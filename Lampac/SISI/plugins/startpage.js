(function() {
  'use strict';

  Lampa.Lang.add({
    lampac_sisiname: {
      ru: 'Клубничка',
      en: 'Strawberry',
      uk: 'Полуничка',
      zh: '草莓'
    }
  });

  if (Lampa.Storage.field("start_page") == 'sisi') window.start_deep_link = {
    component: 'sisi_lampac',
    page: 1,
    url: ''
  };

  Lampa.Params.select('start_page', {
    'main': '#{title_main}',
    'favorite@bookmarks': '#{settings_input_links}',
    'favorite@history': '#{title_history}',
    'mytorrents': '#{title_mytorrents}',
    'last': '#{title_last}',
    'sisi': Lampa.Lang.translate('lampac_sisiname')
  }, 'main');

})();