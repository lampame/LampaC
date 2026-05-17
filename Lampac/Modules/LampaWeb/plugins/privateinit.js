(function () {
    'use strict';

    var unic_id = Lampa.Storage.get('lampac_unic_id', '');
    if (!unic_id) {
       unic_id = Lampa.Utils.uid(8).toLowerCase();
       Lampa.Storage.set('lampac_unic_id', unic_id);
    }
			
    if(!Lampa.Storage.get('lampac_initiale','false')) {
       // исполняется во время первого запуска лампы 
    }
	
    // исполняется при каждой загрузке лампы 
	
	
    /*
       {country} - RU, UA, etc
       {localhost} - адрес по которому лиент запросил данные / пример http://IP:9118
       {jachost} - локальный или внешний адрес JacRed
    */
	
})();