(function () {
	'use strict';

    window.lampa_settings = {
        account_use: false,
        account_sync: false,
        socket_use: false,
        plugins_use: false,
        lang_use: false
    }

    if(!localStorage.getItem('background')){
        localStorage.setItem('background', 'false')
    }
	
	if(!localStorage.getItem('animation')){
        localStorage.setItem('animation', 'false')
    }

    if(!localStorage.getItem('activity')){
        localStorage.setItem('activity',JSON.stringify({
            component: 'start'
        }))
    }
})();