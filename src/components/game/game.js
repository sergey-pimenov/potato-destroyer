import globalState from './../../globalState';
import preload from './preload';
import create from './create';
import update from './update';
import subLayer from './subLayer/subLayer';

globalState.resolution = 1;

export default function() {
  var config = {
    type: Phaser.WEBGL,
    width: gameWidth,
    height: gameHeight,
    canvas: document.querySelector('.game'),
    resolution: globalState.resolution,
    title: 'Potato Destroyer',
    autoFocus: true,
    disableContextMenu: true,

    zoom: 1,

    powerPreference: 'high-performance',

    physics: {
      default: 'arcade',
      'arcade': {
        fps: 60,
        gravity: {
          x: 0,
          y: 0
        },
        checkCollision: {
          up: false,
          down: false
        },

        // debug: true,
        // debugShowBody: true,
        // debugShowStaticBody: true,
        // debugShowVelocity: true
      }
    },

    scene: {
      preload: preload,
      create: create.baseScene,
      update: update.step
    },
  };

  subLayer();

  document.addEventListener('subSceneLoaded', () => {
    window.game = new Phaser.Game(config);
  });
  
  var userScoresArr = JSON.parse(localStorage.getItem('userScores'));

  if(userScoresArr) {
    globalState.scoresAll = userScoresArr;
  } else {
    globalState.scoresAll = [0];
  }
}