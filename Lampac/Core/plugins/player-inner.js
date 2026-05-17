if (element.url && element.isonline) {
  // online.js
} 
else if (element.url) {
  if ({useplayer}) {
    if (Platform.is('browser') && location.host.indexOf("127.0.0.1") !== -1) {
      Noty.show('Видео открыто в playerInner', {time: 3000});
      $.get('{localhost}/player-inner/' + element.url);
      return;
    }

    Player.play(element);
  } 
  else {
    if ({notUseTranscoding} && Platform.is('browser') && location.host.indexOf("127.0.0.1") !== -1)
      Noty.show('Внешний плеер можно указать в init.conf (playerInner)', {time: 3000});
    Player.play(element);
  }
}