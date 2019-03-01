// Register SW
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('../sw.js').then(function (registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// Utils
import detectPlatform from './utils/scripts/detectPlatform';

// Basic
import getAngle from './basic/scripts/getAngle';

// Global state
import globalState from './globalState';

// Components
import domUI from './components/domUI/domUI';
import game from './components/game/game';
import movePlayer from './components/game/movePlayer';

detectPlatform();

window.gameWidth = document.body.getBoundingClientRect().width;
window.gameHeight = document.body.getBoundingClientRect().height;

if(!document.body.classList.contains('mobile')) {
  if(gameWidth > 375) window.gameWidth = 375;
  if(gameHeight > 600) window.gameHeight = 600;
  globalState.platform = 'desktop';
  bootGame();
} else {
  globalState.platform = 'mobile';

  var portraitOrientation = window.matchMedia("(orientation: portrait)");

  if(!portraitOrientation.matches) {
    window.addEventListener('resize', () => {
      if(portraitOrientation.matches && !globalState.gameBooted) {
        globalState.gameBooted = true;

        setTimeout(() => {
          window.gameWidth = document.body.getBoundingClientRect().width;
          window.gameHeight = document.body.getBoundingClientRect().height;

          bootGame();
        }, 1000);
      }
    });
  } else {
    bootGame();
  }
}

function bootGame() {
  domUI.init();
  game();
  getAngle.init();
  movePlayer.init();
}