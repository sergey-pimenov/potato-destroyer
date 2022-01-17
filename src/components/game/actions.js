import globalState from './../../globalState';
import animations from './animations';
import update from './update';
import domUI from './../domUI/domUI';

var actions = {
  player : {
    setDraggable() {
      console.log('Set player draggable');

      globalState.player.visible = true;
      globalState.player.alpha = 0.01;
      globalState.player.setInteractive();
      context.input.setDraggable(globalState.player);

      context.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
      });
    }
  },

  handleBulbo(player, potato) {
    if(potato.touched) return;

    potato.touched = true;

    animations.bug.eat();

    animations.pullObject(player, potato);

    context.physics.accelerateTo(potato, player.x, player.y, 3000);

    actions.health.increase(5);
    actions.scores.add();
  },

  scores : {
    add() {
      globalState.scores++;
      animations.scores(() => {
        globalState.scoresEl.text = globalState.scores;
      });
    },

    reset() {
      globalState.scores = 0;
      globalState.scoresEl.text = globalState.scores;
    },

    updateResults() {
      var userScoresArr = JSON.parse(localStorage.getItem('userScores'));
      var scoresArr = [];

      if(userScoresArr) {
        scoresArr = userScoresArr;
        scoresArr.push(globalState.scores);
  
        localStorage.setItem('userScores', JSON.stringify(scoresArr));
      } else {
        scoresArr.push(globalState.scores);
  
        localStorage.setItem('userScores', JSON.stringify(scoresArr));
      }

      globalState.scoresAll = scoresArr;
    },

    getBest() {
      var bestScores = false;

      globalState.scoresAll.forEach(score1 => {
        if(bestScores) return;

        var foundLowerNumbers = 0;

        globalState.scoresAll.forEach(score2 => {
          if(score1 < score2) {
            ++foundLowerNumbers;
          }
        });

        if(foundLowerNumbers == 0) bestScores = score1;
      });

      return bestScores;
    }
  },

  handleBorder(player, border) {
    if(border.touched) return;

    border.touched = true;

    animations.bug.borderCollision(player, border);
    animations.border.destroy(border);

    actions.health.decrease(20);
  },

  tractor: {
    destroyObject(tractor, object) {
      if(object.touched) return;

      object.touched = true;

      animations.tractor.destroyObject(object, tractor);
    },

    playerCollision(bug, tractor) {
      if(tractor.touched) return;

      tractor.touched = true;
  
      animations.bug.tractorCollision(globalState.player);

      actions.health.decrease(50);
      context.cameras.main.shake(250, 0.02);
    }
  },

  bison: {
    playerCollision(bug, bison) {
      if(bison.touched) return;

      bison.touched = true;
  
      animations.bug.bisonCollision(globalState.player);

      actions.health.decrease(50);
    },

    border(bison, border) {
      animations.bison.destroyBorder(border);
    }
  },

  stork: {
    eatPotato(stork, potato) {
      if(potato.touched) return;

      potato.touched = true;

      globalState.stork.changeTarget = true;

      animations.stork.eatPotato(stork, potato);
    }
  },

  toggleSneakers(value) {
    globalState.playerAnimated.armature.getSlot('boots').displayIndex = value;
    globalState.playerAnimated.armature.getSlot('boots1').displayIndex = value;
    globalState.playerAnimated.armature.getSlot('boots2').displayIndex = value;
    globalState.playerAnimated.armature.getSlot('boots3').displayIndex = value;
    globalState.playerAnimated.armature.getSlot('boots4').displayIndex = value;
    globalState.playerAnimated.armature.getSlot('boots5').displayIndex = value;
  },

  speedUp(player, speedUp) {
    if(speedUp.touched) return;

    speedUp.touched = true;

    if(globalState.gameAccelerationTween != false) {
      globalState.gameAccelerationTween.stop();
      globalState.gameAccelerationTween = false;
    }

    animations.pullObject(player, speedUp);

    actions.speed.change(1.75);

    actions.toggleSneakers(1);

    var resetSpeedCurrentTime = 0;
    var resetSpeedTime = 2500;
    var resetSpeedTimer;

    function resetSpeed() {
      if(globalState.pauseState) return;

      resetSpeedCurrentTime += 16.666;
      resetSpeedTimer = requestAnimationFrame(resetSpeed);

      if(resetSpeedCurrentTime >= resetSpeedTime) {
        actions.speed.change(1);
        actions.toggleSneakers(-1);
        cancelAnimationFrame(resetSpeedTimer);
      }
    }

    resetSpeed();
  },

  glasses(player, glasses) {
    if(glasses.touched) return;

    glasses.touched = true;

    animations.pullObject(player, glasses);

    document.body.classList.add('glasses');

    var resetGlassesCurrentTime = 0;
    var resetGlassesTime = 3500;
    var resetGlassesTimer;

    function resetGlasses() {
      resetGlassesTimer = requestAnimationFrame(resetGlasses);

      if(globalState.pauseState) return;

      resetGlassesCurrentTime += 16.666;

      if(resetGlassesCurrentTime >= resetGlassesTime) {
        document.body.classList.remove('glasses');
        cancelAnimationFrame(resetGlassesTimer);
      }
    }

    resetGlasses();
  },

  health: {
    decrease(n) {
      if(globalState.health - n < 0) {
        globalState.health = 0;
        this.update();
        return;
      }

      globalState.health -= n;
      this.update();
    },

    increase(n) {
      if(globalState.health + n > 100) {
        globalState.health = 100;
        this.update();
        return;
      }

      globalState.health += n;
      this.update();
    },

    reset() {
      globalState.health = 100;
      this.update();
    },

    gameEnd() {
      alert('Game over')
    },

    update() {
      var progress = 150 * globalState.health * 0.01;
      animations.health.update(globalState.healthMask, progress);

      if(globalState.health <= 0) actions.gameOver();
    }
  },

  gameOver() {
    globalState.player.body.enable = false;
    animations.gameOver.slowGame();
    globalState.gameOver = true;
    animations.bug.dead();

    var objectsList = window.game.scene.scenes[0].children.list;

    var objectsToDestroy = [];

    objectsList.forEach(element => {
      if(element.destroyAtFinish == true) {
        objectsToDestroy.push(element);
      }
    });

    objectsToDestroy.forEach(element => {
      element.body.enable = false;
    });

    actions.scores.updateResults();

    animations.hideGameUI();

    domUI.showRestartWindow();
  },

  restartGame() {
    globalState.gameAccelerationTween.stop();
    actions.speed.change(1);
    animations.bug.restart();

    var objectsList = window.game.scene.scenes[0].children.list;

    var objectsToDestroy = [];

    objectsList.forEach(element => {
      if(element.destroyAtFinish == true) {
        objectsToDestroy.push(element);
      }
    });

    objectsToDestroy.forEach(element => {
      element.currentTween.stop();
    });

    var tween = context.tweens.add({
      targets: objectsToDestroy,
      duration: 100,
      alpha: 0,
      scaleX: 0,
      scaleY: 0,
      onComplete() {
        objectsToDestroy.forEach(element => {
          element.destroy();
        });
      }
    });

    actions.health.reset();
    actions.scores.reset();
    actions.toggleSneakers(-1);
    globalState.playerAnimated.y = globalState.playerAnimated.yInitial;
    globalState.player.x = window.docCenter;
    update.reset();

    globalState.gameTime = 0;
    globalState.updateCurrentTime = 0;

    globalState.player.body.enable = true;
    globalState.gameOver = false;
    
    animations.showGameUI();

    domUI.hideRestartWindow();
  },

  speed: {
    change(n) {
      globalState.gameSpeed = n;
      globalState.playerAnimated.animation.timeScale = n;

      for(var i = 0; i < game.scene.scenes[0].children.length; i++) {
        var currentObj = game.scene.scenes[0].children.list[i];

        if(currentObj.movingObj) {
          currentObj.currentTween.timeScale = n;
        }
      }
    }
  },

  startGame() {
    globalState.gameStarded = true;

    animations.showGameUI();
  },

  pause() {
    globalState.pauseState = true;
    context.scene.pause();
    globalState.playerAnimated.animation.timeScale = 0.001;
  },

  resume() {
    globalState.pauseState = false;
    context.scene.resume();
    globalState.playerAnimated.animation.timeScale = 1;
  }
}

export default actions;