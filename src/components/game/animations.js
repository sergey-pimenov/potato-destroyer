import randomInt from './../../utils/scripts/randomInt';
import globalState from './../../globalState';
import actions from './actions';
import getClosestElements from './../../utils/scripts/getClosestElement';

var animations = {
  bug : {
    walk() {
      globalState.playerAnimated.animation.play('walk');
    },

    eat() {
      let attackState = globalState.playerAnimated.animation.getState("eat");

      attackState = globalState.playerAnimated.animation.fadeIn("eat", 0, 1, 1);
      attackState.resetToPose = false;
      attackState.autoFadeOutTime = 0.1;
      attackState.addBoneMask("tentacle1");
      attackState.addBoneMask("tentacle21");
      attackState.addBoneMask("eyeLeft");
      attackState.addBoneMask("eyeRight");
    },

    borderCollision(player, border) {
      var timeTween = context.tweens.addCounter({
        from: 1,
        to: 0.8,
        duration: 500,
        ease: 'Quad.easeOut',
        yoyo: true,
        repeat: 0,
        onStart: () => {
          globalState.gameAccelerationTween = timeTween;
        },
        onUpdate: () => {
          actions.speed.change(timeTween.getValue());
        },
      });

      var rotateZ = -0.2;
      var translateX = -50 * globalState.subLayerResolution;

      if(border.side == 'left') {
        rotateZ *= -1;
        translateX *= -1;
      }

      var tweenScaleAndRotate = context.tweens.add({
        targets: globalState.playerAnimated,
        duration: 150,
        ease: 'Quad.easeOut',
        scaleY: 0.8,
        y: globalState.playerAnimated.y - 50 * globalState.subLayerResolution,
        rotation: rotateZ,
        yoyo: true,
        repeat: 0
      });

      var tweenTranslate = context.tweens.add({
        targets: globalState.player,
        duration: 150,
        ease: 'Quad.easeOut',
        x: globalState.player.x + translateX,
        repeat: 0
      });
    },

    tractorCollision(player) {
      var tween = context.tweens.add({
        targets: globalState.playerAnimated,
        duration: 270,
        ease: 'Quint.easeOut',
        repeat: 0,
        scaleX: 1.3,
        scaleY: 1.3,
        y: globalState.playerAnimated.yInitial - 170,
        rotation: 0.15,
        yoyo: true,
        onStart: () => {
          globalState.player.body.enable = false;
          globalState.playerAnimated.animation.timeScale = 0.2;
        },
        onComplete: () => {
          globalState.player.body.enable = true;
          globalState.playerAnimated.animation.timeScale = 1;
          globalState.playerAnimated.y = globalState.playerAnimated.yInitial;
        }
      });
    },

    bisonCollision(player) {
      var tween = context.tweens.add({
        targets: globalState.playerAnimated,
        duration: 270,
        ease: 'Quint.easeOut',
        repeat: 0,
        scaleX: 1.3,
        scaleY: 1.3,
        y: globalState.playerAnimated.yInitial - 170,
        rotation: 0.15,
        yoyo: true,
        onStart: () => {
          globalState.player.body.enable = false;
          globalState.playerAnimated.animation.timeScale = 0.2;
        },
        onComplete: () => {
          globalState.player.body.enable = true;
          globalState.playerAnimated.animation.timeScale = 1;
          globalState.bison.touched = false;
          globalState.playerAnimated.y = globalState.playerAnimated.yInitial;
        }
      });
    },

    dead() {
      globalState.playerAnimated.animation.play('dead');

      var tween = context.tweens.add({
        targets: globalState.playerAnimated,
        duration: 23200,
        x: window.gameWidth,
        y: -200,
        repeat: 0
      });

      globalState.playerAnimated.deadAnimation = tween;
    },

    restart() {
      globalState.playerAnimated.deadAnimation.stop();
      globalState.playerAnimated.y = window.gameHeight * 2 - 160;
      globalState.playerAnimated.animation.play('walk');
    }
  },

  speed : {
    accelerateGame() {
      var timeTween = context.tweens.addCounter({
        from: globalState.gameSpeed,
        to: 1,
        duration: 3500,
        ease: 'Power1',
        repeat: 0,
        onStart: () => {
          globalState.gameAccelerationTween = timeTween;
        },
        onUpdate: () => {
          actions.speed.change(timeTween.getValue());
        },
      });
    }
  },

  pullObject(target, object) {
    object.currentTween.stop();

    var tween = context.tweens.add({
      targets: object,
      duration: 200,
      x: target.x,
      y: target.y,
      repeat: 0,
      scaleX: 0,
      scaleY: 0,
      onUpdate: () => {
        tween.updateTo('x', target.x, true);
      },
      onComplete: () => {
        object.destroy();
      }
    });
  },

  border : {
    destroy(border) {
      if(border.side == 'left') {
        var tween2 = context.tweens.add({
          targets: border,
          duration: 150,
          repeat: 0,
          ease: 'Quad.easeOut',
          rotation: -0.5,
          x: border.x - 40
        });

        context.cameras.main.zoomTo(1.3, 150, 'Power2');
        context.cameras.main.pan(border.x + 80, border.y - 90, 150, 'Power2');
      }

      if(border.side == 'right') {
        var tween2 = context.tweens.add({
          targets: border,
          duration: 150,
          repeat: 0,
          ease: 'Quad.easeOut',
          rotation: 0.5,
          x: border.x + 40
        });
    
        context.cameras.main.zoomTo(1.3, 150, 'Power2');
        context.cameras.main.pan(border.x - 80, border.y - 90, 150, 'Power2');
      }


      var currentTime = 0;
      var returnTime = 190;
      var returnCameraRAF;

      function returnCamera() {
        if(globalState.pauseState) return;

        currentTime += 16.666;
        returnCameraRAF = requestAnimationFrame(returnCamera);

        if(currentTime >= returnTime) {
          cancelAnimationFrame(returnCameraRAF);

          context.cameras.main.zoomTo(1, 150, 'Power2');
          context.cameras.main.pan(window.gameWidth / 2, window.gameHeight / 2, 150, 'Power2');
        }
      }

      returnCamera();
    }
  },

  health : {
    update(item, size) {
      var tween = context.tweens.add({
        targets: item,
        duration: 100,
        repeat: 0,
        displayWidth: size
      });
    }
  },

  scores(callback) {
    if(globalState.scoresEl.lastTween) {
      globalState.scoresEl.lastTween.stop();
    }

    globalState.scoresEl.alpha = 1;

    var tween = context.tweens.add({
      targets: globalState.scoresEl,
      duration: 90,
      repeat: 0,
      yoyo: true,
      onYoyo: () => {
        callback();
      },
      alpha: 0,
    });

    globalState.scoresEl.lastTween = tween;
  },

  tractor : {
    goDown(direction = 'left') {
      if(direction == 'left') {
        globalState.tractor.objDirection = 'left';

        var path = new Phaser.Curves.Path(-80, -100);

        path.cubicBezierTo(window.gameWidth + 35, window.gameHeight + 70, 
                           window.gameWidth / 2 - 50, window.gameHeight / 2 + 100, 
                           window.gameWidth / 2 + 50, window.gameHeight / 2);

        globalState.tractor.scaleY = 1;
        globalState.tractorAnimated.scaleY = 1.5;
        globalState.tractor.body.setOffset(30, 30);
      } else {
        globalState.tractor.objDirection = 'right';

        var path = new Phaser.Curves.Path(window.gameWidth + 80, -100);

        path.cubicBezierTo(-35, window.gameHeight + 70, 
                           window.gameWidth / 2 + 50, window.gameHeight / 2 + 100, 
                           window.gameWidth / 2 - 50, window.gameHeight / 2);

        globalState.tractor.scaleX = -2;
        globalState.tractorAnimated.scaleY = -1.5;
        globalState.tractor.body.setOffset(20, 30);
      }

      var pseudoTractor = context.add.follower(path, 0, 0, 'tractor');
      pseudoTractor.alpha = 0;

      pseudoTractor.startFollow({
        duration: 2250,
        positionOnPath: true,
        repeat: 0,
        ease: 'Sine.easeIn',
        rotateToPath: true,
        // rotationOffset: 0, TODO
        onStart: () => {
          globalState.tractor.body.enable = true;
          globalState.tractorAnimated.visible = true;
        },
        onUpdate: () => {
          globalState.tractor.x = pseudoTractor.x;
          globalState.tractor.y = pseudoTractor.y;

          globalState.tractorAnimated.x = pseudoTractor.x * 2;
          globalState.tractorAnimated.y = pseudoTractor.y * 2;
          globalState.tractorAnimated._rotation = pseudoTractor._rotation;
        },
        onComplete: () => {
          globalState.tractor.x = -50;
          globalState.tractor.y = -50;
          globalState.tractor._rotation = 0;
          globalState.tractor.body.enable = false;
          globalState.tractor.visible = false;
          globalState.tractor.touched = false;
          globalState.tractorAnimated.visible = false;
        },
      });
    },

    destroyObject(object, target) {
      if(object.objName == 'border') {
        var translateX = 200;
        var rotateZ = -1;

        if(object.side == 'left') {
          translateX = translateX * -1;
          rotateZ = rotateZ * -1;
        }

        var tween = context.tweens.add({
          targets: object,
          duration: 200,
          repeat: 0,
          rotation: rotateZ,
          x: object.x + translateX,
          alpha: 0,
          onComplete: () => {
            object.destroy();
          }
        });
      } else {
        var tween = context.tweens.add({
          targets: object,
          duration: 200,
          repeat: 0,
          scaleX: 0,
          scaleY: 0,
          rotation: 5,
          onComplete: () => {
            object.destroy();
          }
        });
      }
    }
  },

  bison : {
    goDown() {
      globalState.bison.x = randomInt(50, window.gameWidth - 50);
  
      var tween = context.tweens.add({
        targets: globalState.bison,
        duration: 2000,
        repeat: 0,
        y: window.gameHeight + 200,
        onUpdate: () => {
          globalState.bisonAnimated.y = globalState.bison.y * 2;
          globalState.bisonAnimated.x = globalState.bison.x * 2;
        },
        onStart: () => {
          globalState.bison.body.enable = true;
          globalState.bisonAnimated.visible = true;
        },
        onComplete: () => {
          globalState.bison.body.enable = false;
          globalState.bisonAnimated.visible = false;
          globalState.bison.y = -100;
          globalState.bisonAnimated.y = globalState.bison.y * 2;
          globalState.bisonAnimated.x = globalState.bison.x * 2;
        }
      });
    },

    destroyBorder(border) {
      var translateX;
      var rotate;

      if(border.side == 'left') {
        translateX = -150;
        rotate = -1.3;
      } else {
        translateX = 150;
        rotate = 1.3;
      }

      var tween = context.tweens.add({
        targets: border,
        duration: 150,
        repeat: 0,
        x: border.x + translateX,
        y: border.y + 300,
        rotation: rotate,
        onComplete: () => {
          globalState.bison.body.enable = false;
        }
      });
    }
  },

  stork: {
    goRight(callback) {
      // globalState.stork.flipX = true;
      globalState.stork.x = globalState.stork.initialX + window.gameWidth + globalState.stork.width * 2;
      globalState.stork.y = globalState.stork.initialY;

      var currentElement = window.game.scene.scenes[0].children.list;
      var currentPotatos = [];

      currentElement.forEach(element => {
        if(element.objName == 'potato' && element.y > 0) {
          currentPotatos.push(element);
        }
      });

      var target = getClosestElements(globalState.stork.x, globalState.stork.y, currentPotatos);

      if(!target || target.y >= window.gameHeight / 2) {
        return;
      }

      var path = { t: 0, vec: new Phaser.Math.Vector2() };

      var curve = new Phaser.Curves.Spline([
          -150, 50,
          target.x, target.y,
          window.gameWidth + 150, 50
      ]);
  
      var points = curve.points;
  
      // Uncomment to debug
      // for (var i = 0; i < points.length; i++) {
      //     var point = points[i];
      //     context.add.image(point.x, point.y, 'dragcircle', 0);
      // }
  
      var graphics = context.add.graphics();
  
      var tween = context.tweens.add({
          targets: path,
          t: 1,
          ease: 'Power3',
          duration: 3000,
          repeat: 0,
          onStart: () => {
            globalState.stork.body.enable = true;
            globalState.storkAnimated.visible = true;
          },
          onComplete: () => {
            globalState.stork.changeTarget = false;
            globalState.stork.body.enable = false;
            globalState.storkAnimated.visible = false;
          },
          onUpdate: () => {
            // Uncomment to debug
            // graphics.clear();
            // graphics.lineStyle(2, 0xffffff, 1);  
            // curve.draw(graphics, 34);
  
            curve.getPoint(path.t, path.vec);

            curve.points[1].x = target.x;
            curve.points[1].y = target.y;
  
            globalState.stork.x = path.vec.x;
            globalState.stork.y = path.vec.y;

            globalState.storkAnimated.x = globalState.stork.x * 2;
            globalState.storkAnimated.y = globalState.stork.y * 2 + 80;

            if(globalState.stork.changeTarget) {
              var currentAngle = Phaser.Math.Angle.Between(globalState.stork.x,
                                                           globalState.stork.y, 
                                                           curve.points[2].x, 
                                                           curve.points[2].y);
            } else {
              var currentAngle = Phaser.Math.Angle.Between(globalState.stork.x,
                globalState.stork.y, 
                target.x, 
                target.y);
            }
  
            globalState.stork.rotation = currentAngle;
            globalState.storkAnimated.rotation = globalState.stork.rotation;
          }
      });
    },

    eatPotato(stork, potato) {
      var tween = context.tweens.add({
        targets: potato,
        duration: 150,
        repeat: 0,
        scaleX: 0,
        scaleY: 0,
        onComplete: () => {
          potato.destroy();
        }
      });
    }
  },

  showGameUI() {
    var tween = context.tweens.add({
      targets: [
        globalState.healthItemSubstrate,
        globalState.healthItem,
        globalState.scoresEl
      ],
      duration: 300,
      repeat: 0,
      alpha: 1
    });
  },

  hideGameUI() {
    var tween = context.tweens.add({
      targets: [
        globalState.healthItemSubstrate,
        globalState.healthItem,
        globalState.scoresEl
      ],
      duration: 300,
      repeat: 0,
      alpha: 0
    });
  },

  gameOver: {
    slowGame() {
      if(globalState.gameAccelerationTween) {
        globalState.gameAccelerationTween.stop();
      }

      var timeTween = context.tweens.addCounter({
        from: 1,
        to: 0.5,
        duration: 4000,
        ease: 'Quad.easeOut',
        repeat: 0,
        onStart: () => {
          globalState.gameAccelerationTween = timeTween;
        },
        onUpdate: () => {
          actions.speed.change(timeTween.getValue());
        },
      });
    }
  }
}

export default animations;