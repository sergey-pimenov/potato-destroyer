import globalState from './../../globalState';
import getAngle from './../../basic/scripts/getAngle';
import { setInterval } from 'core-js';

var xVelocity = 0;
var keyDown = false;
var currentDirection = null;
var keyPressTimeout;

var movePlayer = {
  selectedInterface: false,
  xMove: false,
  direction: 1,

  update() {
    globalState.player.setVelocityX(25 * movePlayer.xMove);
    globalState.player.setAngularVelocity(5 * movePlayer.xMove);
    globalState.player.rotation = 0.01 * movePlayer.xMove;

    // globalState.playerAnimated.x = globalState.player.x * globalState.resolution;
    globalState.playerAnimated.x = globalState.player.x * globalState.subLayerResolution;
    globalState.playerAnimated.rotation = globalState.player.rotation;
  },

  'byArrows' : {
    'KeyboardController': function(keys, repeat) {
      // From https://stackoverflow.com/a/3691661
      var timers= {};
  
      document.onkeydown= function(event) {
        var key= (event || window.event).keyCode;
        if (!(key in keys))
            return true;
        if (!(key in timers)) {
            timers[key]= null;
            keys[key]();
            if (repeat!==0)
                timers[key]= setInterval(keys[key], repeat);
        }
        return false;
      };
  

      document.onkeyup= function(event) {
        var key= (event || window.event).keyCode;
        if (key in timers) {
            if (timers[key]!==null)
                clearInterval(timers[key]);
            delete timers[key];
        }
      };
  
      window.onblur= function() {
        for (key in timers)
            if (timers[key]!==null)
                clearInterval(timers[key]);
        timers= {};
      };
    },

    init() {
      this.KeyboardController({
        37: function() { 
          currentDirection = 'left';
          keyDown = true;
        },
        65: function() { 
          currentDirection = 'left';
          keyDown = true;
        },
        39: function() { 
          currentDirection = 'right';
          keyDown = true;
        },
        68: function() { 
          currentDirection = 'right';
          keyDown = true;
        }
      }, 16.6666);

      window.addEventListener('keyup', (e) => {
        keyDown = false;
        currentDirection = null;
      });
    },

    'updatePosition': function() {
      movePlayer.xMove = xVelocity;

      if(!keyDown) {
        if(xVelocity == 0) return;

        if(xVelocity < 0) {
          xVelocity += 2;

          setTimeout(() => {
            if(xVelocity > 0 && !keyDown) xVelocity = 0;
          }, 150);
        }

        if(xVelocity > 0) {
          xVelocity -= 2;

          setTimeout(() => {
            if(xVelocity < 0 && !keyDown) xVelocity = 0;
          }, 150);
        }

        return;
      }

      if(currentDirection == 'left' && xVelocity > -25) {
        xVelocity -= 2;

        if(xVelocity > 0) {
          xVelocity = 0;
          return;
        }

        return;
      }

      if(currentDirection == 'right' && xVelocity < 25) {
        xVelocity += 2;

        if(xVelocity < 0) {
          xVelocity = 0;
          return;
        }

        return;
      }
    }
  },

  byDeviceRotating() {
    if(getAngle.degreeYRounded > 90) {
      movePlayer.direction = -1;
    } else {
      movePlayer.direction = 1;
    }

    movePlayer.xMove = getAngle.degreeXRounded * movePlayer.direction;
  },

  init() {
    window.addEventListener('detectAccelerometerSupporting', () => {
      if(globalState.accelerometer) {
        movePlayer.selectedInterface = movePlayer.byDeviceRotating;
        movePlayer.byDeviceRotating();
      } else {
        movePlayer.byArrows.init();
        movePlayer.selectedInterface = movePlayer.byArrows.updatePosition;
      }
    });
  }
}

export default movePlayer;