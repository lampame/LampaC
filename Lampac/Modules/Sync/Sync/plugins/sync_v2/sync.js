(function() {
  'use strict';
  
  if ('{token}' == '') Lampa.Utils.putScriptAsync(["{localhost}/bookmark.js", "{localhost}/timecode.js"], function() {});
  else Lampa.Utils.putScriptAsync(["{localhost}/bookmark/js/{token}", "{localhost}/timecode/js/{token}"], function() {});
  
  {sync-invc}
  
  if (!window.lampac_storage_import_keys)
    window.lampac_storage_import_keys = [];

  function account(url) {
    url = url + '';
    if (url.indexOf('account_email=') == -1) {
      var email = Lampa.Storage.get('account_email');
      if (email) url = Lampa.Utils.addUrlComponent(url, 'account_email=' + encodeURIComponent(email));
    }
    if (url.indexOf('uid=') == -1) {
      var uid = Lampa.Storage.get('lampac_unic_id', '');
      if (uid) url = Lampa.Utils.addUrlComponent(url, 'uid=' + encodeURIComponent(uid));
    }
    if (url.indexOf('token=') == -1) {
      var token = '{token}';
      if (token != '') url = Lampa.Utils.addUrlComponent(url, 'token={token}');
    }
    return url;
  }
  
  function sync_import_keys() {
    function toArr(x) {
      if (Object.prototype.toString.call(x) === '[object Array]') return x.slice();
      if (typeof x === 'string') return [x];
      return [];
    }
    var base = toArr(sync_invc.import_keys);
    var ext = toArr(window.lampac_storage_import_keys);

    var seen = {};
    var merged = base.concat(ext).filter(function(k) {
      if (typeof k !== 'string' || k === '') return false;
      if (seen[k]) return false;
      seen[k] = true;
      return true;
    });

    return merged;
  }


  function goExport(path) {
    if (window.sync_disable) 
        return;
	
    var value = {};
    value = sync_invc.goExport(path, value);

    if (path == 'sync_view') {
      ['online_view', 'online_last_balanser', 'online_watched_last', 'torrents_view', 'torrents_filter_data'].forEach(function(field) {
        value[field] = Lampa.Storage.get(field, '');
      });
    }
	
	if (Object.keys(value).length === 0) 
      return;
	
    var uri = account('{localhost}/storage/set?path='+path+'&pathfile='+Lampa.Storage.get('lampac_profile_id', ''));
	
	if (window.lwsEvent && window.lwsEvent.connectionId != '') 
		uri = Lampa.Utils.addUrlComponent(uri, 'connectionId=' + encodeURIComponent(window.lwsEvent.connectionId));

    $.ajax({
      url: uri,
      type: 'POST',
      data: JSON.stringify(value),
      async: true,
      cache: false,
      contentType: false,
      processData: false,
      success: function(j) {
        if (j.success && j.fileInfo)
          Lampa.Storage.set('lampac_' + path, j.fileInfo.changeTime);
      },
      error: function() {
        console.log('Lampac Storage', 'export', 'error');
      }
    });
  }


  function goImport(path, call) {
    if (window.sync_disable || path == '') 
        return;
    var network = new Lampa.Reguest();
    network.silent(account('{localhost}/storage/get?path='+path+'&pathfile='+Lampa.Storage.get('lampac_profile_id', '')), function(j) {
      if (j.success && j.fileInfo && j.data) {
        if (j.fileInfo.changeTime > Lampa.Storage.get('lampac_' + path, '0')) {
          try {
            var data = JSON.parse(j.data);
            for (var i in data) {
              Lampa.Storage.set(i, data[i], true);
              if (i == 'favorite') Lampa.Favorite.init();
            }
            Lampa.Storage.set('lampac_' + path, j.fileInfo.changeTime);
          } catch (error) {
            console.log('Lampac Storage', 'import', error.message);
          }
        }
      } else if (j.msg && j.msg == 'outFile') {
        goExport(path);
      }
      call();
      sync_invc.importСompleted(path);
      Lampa.Listener.send('lampac', {name: 'storage_importСompleted', value: path});
    });
  }


  function sync() {
    if (!window.sync_init) {
      window.sync_init = true;
      goImport('sync_view', function() {
        sync_import_keys().forEach(function(key) {
          goImport(key, function() {});
        });

		/*
          принудительный экспорт ключа recomends_list из localStorage на сервер
            Lampa.Storage.listener.send('change', {name: 'recomends_list', value: ''});
		*/
        Lampa.Storage.listener.follow('change', function(e) {
          if (sync_import_keys().indexOf(e.name) >= 0) {
            goExport(e.name);
          } else if (e.name.indexOf('online_view') >= 0 || e.name.indexOf('torrents_view') >= 0) {
            goExport('sync_view');
          }
        });
		
		/*
          принудительный импорт ключа recomends_list с сервера в localStorage
            window.lwsEvent.send('sync_storage', 'recomends_list');
		*/
        document.addEventListener('lwsEvent', function(evnt) {
          if (evnt.detail.name === 'sync_storage') {
            goImport(evnt.detail.data, function() {});
          } 
          else if (evnt.detail.name === 'storage') {
            var ob = JSON.parse(evnt.detail.data);
			if (ob.pathfile != '' && ob.pathfile != Lampa.Storage.get('lampac_profile_id', '')) return;
            goImport(ob.path, function() {});
          } 
          else if (evnt.detail.name === 'system' && evnt.detail.data === 'reconnected') {
            goImport('sync_view', function() {});
            sync_import_keys().forEach(function(key) {
              goImport(key, function() {});
            });
          }
        });
      });
    }
  }

  if (!window.lwsEvent) {
    Lampa.Utils.putScript([account("{localhost}/invc-ws.js")], function() {}, false, function() {
      sync();
    }, true);
  } else sync();

})();