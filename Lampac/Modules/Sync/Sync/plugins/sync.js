(function() {
  'use strict';
  
  {sync-invc}

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


  function goExport(path) {
    if (window.sync_disable) 
        return;
	
    var value = {};
    value = sync_invc.goExport(path, value);

    if (Object.keys(value).length === 0) {
      if (path == 'sync_view') {
        ['file_view', 'online_view', 'online_last_balanser', 'online_watched_last', 'torrents_view', 'torrents_filter_data'].forEach(function(field) {
          value[field] = Lampa.Storage.get(field, '');
        });

        var acc = Lampa.Storage.get('account', '{}');
        if (acc.profile) {
          var name = 'file_view' + '_' + acc.profile.id;
          value[name] = Lampa.Storage.get(name, '');
        }
      } else {
        value.favorite = Lampa.Storage.get('favorite', '');
        value.account_bookmarks = Lampa.Storage.get('account_bookmarks', '');
      }
    }
	
    var uri = account('{localhost}/storage/set?path='+path+'&pathfile='+Lampa.Storage.get('lampac_profile_id', ''));

    $.ajax({
      url: uri + '&events=' + encodeURIComponent(Lampa.Base64.encode(JSON.stringify({connectionId: (window.lwsEvent ? window.lwsEvent.connectionId : ''), name: 'sync', data: path}))),
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
    });
  }


  function sync() {
    if (!window.sync_init) {
      window.sync_init = true;
      goImport('sync_favorite', function() {
        goImport('sync_view', function() {
          sync_invc.import_keys.forEach(function(key) {
            goImport(key, function() {});
          });
          Lampa.Storage.listener.follow('change', function(e) {
            if (sync_invc.import_keys.indexOf(e.name) >= 0) {
              goExport(e.name);
            }
			else if (e.name == 'favorite' || e.name.indexOf('file_view') >= 0) {
              goExport(e.name == 'favorite' ? 'sync_favorite' : 'sync_view');
            }
          });
          document.addEventListener('lwsEvent', function(evnt) {
            if (evnt.detail.name === 'sync') {
              goImport(evnt.detail.data, function() {});
            } else if (evnt.detail.name === 'system' && evnt.detail.data === 'reconnected') {
              goImport('sync_favorite', function() {});
              goImport('sync_view', function() {});
              sync_invc.import_keys.forEach(function(key) {
                goImport(key, function() {});
              });
            }
          });
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