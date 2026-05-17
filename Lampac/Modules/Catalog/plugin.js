(function () {
    'use strict';

    var Manifest = {api_host:'{localhost}',catalogs:{}};

    function account(url){url=url+'';if(url.indexOf('account_email=')==-1){var email=Lampa.Storage.get('account_email');if(email)url=Lampa.Utils.addUrlComponent(url,'account_email='+encodeURIComponent(email));}if(url.indexOf('uid=')==-1){var uid=Lampa.Storage.get('lampac_unic_id','');if(uid)url=Lampa.Utils.addUrlComponent(url,'uid='+encodeURIComponent(uid));}if(url.indexOf('token=')==-1){var token='{token}';if(token!='')url=Lampa.Utils.addUrlComponent(url,'token={token}');}return url;}var Utils = {account:account};

    var network=new Lampa.Reguest();/**
     * Формирование URL для запросов
     * @param {string} u - метод API
     * @param {object} params - параметры запроса
     * @returns {string} - полный URL
     */function url(u){var params=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};if(params.page)u=add(u,'page='+params.page);if(params.query)u=add(u,'query='+params.query);return Manifest.api_host+Utils.account(u);}/**
     * Добавление параметра к URL
     * @param {string} u - URL
     * @param {string} params - параметры запроса
     * @returns {string} - URL с добавленным параметром
     */function add(u,params){return u+(/\?/.test(u)?'&':'?')+params;}/**
     * Запрос к API
     * @param {string} method - метод API
     * @param {object} params - параметры запроса
     * @param {function} oncomplite - функция успешного завершения
     * @param {function} onerror - функция ошибки
     */function get(method){var params=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var oncomplite=arguments.length>2?arguments[2]:undefined;var onerror=arguments.length>3?arguments[3]:undefined;var u=url(method,params);network.silent(u,function(json){json.url=method;oncomplite(addSource(json));},onerror);}function getCatalog(){return Manifest.catalogs[Lampa.Storage.field('source')];}function addSource(data,custom){var source=custom||Lampa.Storage.field('source');if(Lampa.Arrays.isObject(data)&&Lampa.Arrays.isArray(data.results)){data.results.forEach(function(item){if(!item.source)item.source=source;});}else if(Lampa.Arrays.isArray(data)){data.forEach(function(item){if(!item.source)item.source=source;});}return data;}/**
     * Главная страница
     * @param {object} params - параметры запроса
     * @param {function} oncomplite - функция успешного завершения
     * @param {function} onerror - функция ошибки
     * @returns {function} - функция для загрузки следующей части
     */function main(){var params=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var oncomplite=arguments.length>1?arguments[1]:undefined;var onerror=arguments.length>2?arguments[2]:undefined;var catalog=getCatalog();var parts_limit=6;var parts_data=[];if(catalog&&catalog.main){var addPart=function addPart(title,url){parts_data.push(function(call){get(url,params,function(json){json.title=title;call(json);},call);});};for(var i in catalog.main){addPart(i,Utils.account(catalog.main[i]));}}else return onerror();function loadPart(partLoaded,partEmpty){Lampa.Api.partNext(parts_data,parts_limit,partLoaded,partEmpty);}loadPart(oncomplite,onerror);return loadPart;}/**
     * Категория
     * @param {object} params - параметры запроса
     * @param {function} oncomplite - функция успешного завершения
     * @param {function} onerror - функция ошибки
     * @returns {function} - функция для загрузки следующей части
     */function category(){var params=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var oncomplite=arguments.length>1?arguments[1]:undefined;var onerror=arguments.length>2?arguments[2]:undefined;var catalog=getCatalog();var parts_limit=6;var parts_data=[];if(catalog&&catalog[params.url]){var addPart=function addPart(title,url){parts_data.push(function(call){get(url,params,function(json){json.title=title;call(json);},call);});};for(var i in catalog[params.url]){addPart(i,Utils.account(catalog[params.url][i]));}}else return onerror();function loadPart(partLoaded,partEmpty){Lampa.Api.partNext(parts_data,parts_limit,partLoaded,partEmpty);}loadPart(oncomplite,onerror);return loadPart;}/**
     * Полный просмотр категории (фильмы, сериалы, аниме)
     * @param {object} params - параметры запроса
     * @param {function} oncomplite - функция успешного завершения
     * @param {function} onerror - функция ошибки
     */function list(){var params=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var oncomplite=arguments.length>1?arguments[1]:undefined;var onerror=arguments.length>2?arguments[2]:undefined;if(params.genres&&typeof params.genres=='number')return Lampa.Api.sources.tmdb.list(params,oncomplite,onerror);var u=url(params.id||params.genres||params.url,params);network.silent(u,oncomplite,onerror);}function full(params,oncomplite){var require=1;// Количество обязательных запросов
    var status=new Lampa.Status(require);status.onComplite=oncomplite;var url='/catalog/card?plugin='+params.source+'&uri='+encodeURIComponent(params.id)+'&type='+(params.method||'movie');get(Utils.account(url),params,function(json){// Источник
    json.source=params.source;if(json.seasons&&json.seasons.length){var season=Lampa.Utils.countSeasons(json);if(season){status.need++;Lampa.Api.sources.tmdb.get('tv/'+json.tmdb_id+'/season/'+season,{},function(ep){status.append('episodes',ep);},status.error.bind(status));}}if(json.tmdb_id){status.need++;Lampa.Api.sources.cub.reactionsGet({id:json.tmdb_id,method:json.original_name?'tv':'movie'},function(reactions){status.append('reactions',reactions);});}if(json.credits)status.data['persons']=json.credits;if(json.recommendations)status.data['recomend']=addSource({results:json.recommendations},'tmdb');if(json.similar)status.data['simular']=addSource({results:json.similar},'tmdb');if(json.videos)status.data['videos']=addSource({results:json.videos},'tmdb');// Результат
    status.append('movie',json);},function(){status.error();});}/**
     * Поиск
     * @param {object} params - параметры запроса
     * @param {function} oncomplite - функция успешного завершения
     * @returns {void}
     */function search(catalog_name){var params=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var oncomplite=arguments.length>2?arguments[2]:undefined;var catalog=Manifest.catalogs[catalog_name];if(!catalog||!catalog.search)return oncomplite([]);var u=Utils.account(catalog.search);if(!u)return oncomplite([]);get(u,params,function(json){json.title='Найдено';json.results.forEach(function(item){item.source=catalog_name;});oncomplite([json]);},function(){oncomplite([]);});}function person(){var params=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var oncomplite=arguments.length>1?arguments[1]:undefined;var onerror=arguments.length>2?arguments[2]:undefined;Lampa.Api.sources.tmdb.person(params,oncomplite,onerror);}/**
     * Добавить кнопку в поисковую строку
     * @returns {object} - объект кнопки
     */function discovery(catalog_name){var catalog=Manifest.catalogs[catalog_name];return {title:catalog_name,search:search.bind(search,catalog_name),params:{align_left:true,lazy:(catalog===null||catalog===void 0?void 0:catalog.search_lazy)||false,object:{source:catalog_name}},onMore:function onMore(params){// Переход из кнопки "Ещё"
    Lampa.Activity.push({url:catalog.search,title:Lampa.Lang.translate('search')+' - '+params.query,component:'category_full',page:2,query:encodeURIComponent(params.query),source:catalog_name});},onCancel:network.clear.bind(network)};}/**
     * Получить список категорий для каталога в меню
     * @param {object} params - параметры запроса
     * @param {function} oncomplite - функция успешного завершения
     */function menu(params,oncomplite){var menu=[];var catalog=getCatalog();if(catalog){for(var i in catalog.menu){menu.push({title:i,id:catalog.menu[i]});}}oncomplite(menu);}function clear(){network.clear();}var Api = {main:main,menu:menu,full:full,list:list,category:category,clear:clear,discovery:discovery,getCatalog:getCatalog,person:person};

    function loadCatalogs(){if(Manifest.catalogs&&Object.keys(Manifest.catalogs).length){var keys=Object.keys(Manifest.catalogs);keys.forEach(function(key){Lampa.Params.values.source[key]=key;Object.defineProperty(Lampa.Api.sources,key,{get:function get(){return Api;}});if(Manifest.catalogs[key].search)Lampa.Search.addSource(Api.discovery(key));});}else {var network=new Lampa.Reguest();network.silent(Utils.account(Manifest.api_host+'/catalog'),function(json){var keys=Object.keys(json);Manifest.catalogs=json;keys.forEach(function(key){Lampa.Params.values.source[key]=key;Object.defineProperty(Lampa.Api.sources,key,{get:function get(){return Api;}});if(Manifest.catalogs[key].search)Lampa.Search.addSource(Api.discovery(key));});});}Lampa.Listener.follow('menu',function(e){if(e.type=='action'&&(e.action=='tv'||e.action=='cartoon'||e.action=='anime'||e.action=='movie'||e.action=='relise')){var catalog=Api.getCatalog();if(!catalog)return;var actionMap={movie:{key:'movie',title:'menu_movies'},tv:{key:'tv',title:'menu_tv'},cartoon:{key:'cartoons',title:'menu_multmovie'},anime:{key:'anime',title:'menu_anime'},relise:{key:'relise',title:'menu_relise'}};if(actionMap[e.action]){var groupKey=actionMap[e.action].key;var group=catalog[groupKey];if(group&&Object.keys(group).length==1){var url=group[Object.keys(group)[0]];Lampa.Router.call('category_full',{url:url,title:Lampa.Lang.translate(actionMap[e.action].title)+' - '+Lampa.Storage.field('source').toUpperCase()});e.abort();}else if(group){Lampa.Router.call('category',{url:actionMap[e.action].key,title:Lampa.Lang.translate(actionMap[e.action].title)+' - '+Lampa.Storage.field('source').toUpperCase()});e.abort();}}}});}function startPlugin(){window.plugin_catalog=true;if(window.appready)loadCatalogs();else {Lampa.Listener.follow('app',function(e){if(e.type=='ready')loadCatalogs();});}}if(!window.plugin_catalog)startPlugin();

})();