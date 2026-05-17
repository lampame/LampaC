(function() {
  'use strict';

  Lampa.Listener.follow('request_before', function(e) {
    var proxy_url = '{localhost}/cub/';
    var need_proxy = Lampa.Manifest.cub_mirrors.find(function(mirror) {
      return e.params.url.indexOf(mirror) > -1;
    });

    if (need_proxy && e.params.url.indexOf('/cub/') == -1) {
      e.params.url = proxy_url + e.params.url.replace(/^https?:\/\//, '');
    }
  });

})();