(function(global) {
  'use strict';

  function NativeWsClient(url, options) {

    this.options = options || {};
    this.wsVersion = this.options.wsVersion;
    if (typeof this.wsVersion !== 'number' || this.wsVersion <= 0) {
      this.wsVersion = 1;
    }

    if (typeof Lampa !== 'undefined' && Lampa) {
      var nws_id = Lampa.Storage.get('lampac_nws_id', '');
      if (!nws_id) {
        nws_id = Lampa.Utils.uid(32).toLowerCase();
        Lampa.Storage.set('lampac_nws_id', nws_id);
      }
      this.url = Lampa.Utils.addUrlComponent(url, 'id=' + nws_id);
      this.url = Lampa.Utils.addUrlComponent(this.url, 'ver=' + this.wsVersion);
    } else {
      this.url = url;
    }

    this.socket = null;
    this.connectionId = null;
    this.handlers = {};
    this.queue = [];
    this.reconnectDelay = this.options.reconnectDelay;
    if (typeof this.reconnectDelay !== 'number' || this.reconnectDelay <= 0) {
      this.reconnectDelay = 2000;
    }
    this._shouldReconnect = !!this.options.autoReconnect;
    this._reconnectTimer = null;
    this._manualReconnect = false;
    this._pingTimer = null;
    this._blockedByVersion = false;
  }

  NativeWsClient.prototype.connect = function() {
    var self = this;

    if (self._blockedByVersion) {
      return;
    }

    if (self.socket && (self.socket.readyState === WebSocket.OPEN || self.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      self.socket = new WebSocket(self.url);
    } catch (err) {
      self._scheduleReconnect();
      return;
    }

    self.socket.onopen = function() {
      self._clearReconnect();
      self._startPing();
      self._flushQueue();
      self._emit('Open', []);
      if (typeof self.options.onOpen === 'function') {
        self.options.onOpen();
      }
    };

    self.socket.onmessage = function(event) {
      self._handleMessage(event);
    };

    self.socket.onclose = function(event) {
      if (self._manualReconnect) {
        self._manualReconnect = false;
        return;
      }
      self._stopPing();
      self.connectionId = null;
      self._checkVersionBlock(event);
      if (typeof self.options.onClose === 'function') {
        self.options.onClose(event);
      }
      if (self._shouldReconnect) {
        self._scheduleReconnect();
      }
    };

    self.socket.onerror = function(event) {
      if (typeof self.options.onError === 'function') {
        self.options.onError(event);
      }
    };
  };

  NativeWsClient.prototype._handleMessage = function (event) {
    if (typeof event.data === 'string' && event.data === 'pong') {
      this._emit('Pong', []);
      return;
    }

    var message;
    try {
      message = JSON.parse(event.data);
    } catch (err) {
      return;
    }

    if (!message || typeof message.method !== 'string') {
      return;
    }

    var method = message.method;
    var args = message.args || [];

    if (method === 'Connected' && args.length > 0) {
      this.connectionId = args[0];
    }

    this._emit(method, args);
  };

  NativeWsClient.prototype._emit = function(method, args) {
    var callbacks = this.handlers[method];
    if (!callbacks || !callbacks.length) {
      return;
    }

    for (var i = 0; i < callbacks.length; i++) {
      try {
        callbacks[i].apply(null, args);
      } catch (err) {
        if (typeof console !== 'undefined' && typeof console.error === 'function') {
          console.error('nws handler error:', err);
        }
      }
    }
  };

  NativeWsClient.prototype.invoke = function(method) {
    if (!method) {
      return;
    }

    var args = Array.prototype.slice.call(arguments, 1);
    var payload = JSON.stringify({
      method: method,
      args: args
    });

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.queue.push(payload);
      return;
    }

    this.socket.send(payload);
  };

  NativeWsClient.prototype.on = function(method, handler) {
    if (!this.handlers[method]) {
      this.handlers[method] = [];
    }
    this.handlers[method].push(handler);
  };

  NativeWsClient.prototype.off = function(method, handler) {
    var callbacks = this.handlers[method];
    if (!callbacks) {
      return;
    }

    var index = callbacks.indexOf(handler);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  };

  NativeWsClient.prototype.close = function() {
    this._shouldReconnect = false;
    this._clearReconnect();
    this._stopPing();
    if (this.socket) {
      this.socket.close();
    }
  };

  NativeWsClient.prototype.reconnect = function(done) {
    var self = this;
    var handled = false;

    if (self._blockedByVersion)
          return;

    function onConnected() {
      if (handled) return;
      handled = true;
      self.off('RchRegistry', onConnected);
      if (typeof done === 'function') done();
    }

    self.on('RchRegistry', onConnected);
    self._clearReconnect();
    self._stopPing();
    self.connectionId = null;

    if (self.socket && (self.socket.readyState === WebSocket.OPEN || self.socket.readyState === WebSocket.CONNECTING)) {
      try {
        self._manualReconnect = true;
        self.socket.close();
      } catch (e) {}
    }

    setTimeout(function() {
      self.connect();
    }, 0);
  };

  NativeWsClient.prototype._flushQueue = function() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    while (this.queue.length > 0) {
      var payload = this.queue.shift();
      this.socket.send(payload);
    }
  };

  NativeWsClient.prototype._scheduleReconnect = function() {
    var self = this;
    if (self._blockedByVersion || !self._shouldReconnect || self._reconnectTimer) {
      return;
    }

    self._reconnectTimer = setTimeout(function() {
      self._reconnectTimer = null;
      self.connect();
    }, self.reconnectDelay);
  };

  NativeWsClient.prototype._checkVersionBlock = function(event) {
    var reason = event && typeof event.reason === 'string' ? event.reason : '';
    if (reason.indexOf('ws_version_too_low:') !== 0) {
      return;
    }

    this._blockedByVersion = true;
    this._shouldReconnect = false;
    this._clearReconnect();
  };

  NativeWsClient.prototype._clearReconnect = function() {
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer);
      this._reconnectTimer = null;
    }
  };

  NativeWsClient.prototype._startPing = function() {
    var self = this;
    if (self._pingTimer) return;
    self._pingTimer = setInterval(function() {
      if (self.socket && self.socket.readyState === WebSocket.OPEN) {
        try {
          self.socket.send("ping");
        } catch (e) {}
      }
    }, 50000);
  };

  NativeWsClient.prototype._stopPing = function() {
    if (this._pingTimer) {
      clearInterval(this._pingTimer);
      this._pingTimer = null;
    }
  };

  global.NativeWsClient = NativeWsClient;
})(this);

/*
Example usage (ES5):

var client = new NativeWsClient('ws://localhost:9118/nws', {
    autoReconnect: true,
    reconnectDelay: 2000
});

client.on('Connected', function (connectionId) {
    console.log('Connected with id:', connectionId);
    client.invoke('RegistryWebLog', 'my_token');
});

client.on('Receive', function (message, plugin) {
    console.log('Log from', plugin, message);
});

client.on('event', function (uid, name, data) {
    console.log('Event', uid, name, data);
});

client.connect();
*/
