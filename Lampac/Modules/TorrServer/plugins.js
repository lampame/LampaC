(function () {
    'use strict';
	
    var unic_id = Lampa.Storage.get('lampac_unic_id', '');
    if (!unic_id) {
      unic_id = Lampa.Utils.uid(8).toLowerCase();
      Lampa.Storage.set('lampac_unic_id', unic_id);
    }

    Lampa.Storage.set('torrserver_url','{localhost}/ts');
    Lampa.Storage.set('torrserver_auth','true');
    Lampa.Storage.set('torrserver_login', unic_id || Lampa.Storage.get('account_email') || 'ts');
    Lampa.Storage.set('torrserver_password','ts');
	
})();