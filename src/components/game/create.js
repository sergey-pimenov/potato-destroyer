import randomInt from './../../utils/scripts/randomInt';
import globalState from './../../globalState';
import actions from './actions';
import animations from './animations';

window.context = null;

var leftOrRight = 0;
var currentObjCount = 0;

var baseObjectsOrder = [
  'potato',
  'potato',
  'borderLeft',
  'potato',
  'potato',
  'borderRight',
  'potato',
  'potato',
  'borderLeft',
  'potato',
  'potato',
  'borderRight',
];

var create = {
  baseScene() {
    context = this;

    window.docBottom = window.gameHeight;
    window.docCenter = window.gameWidth / 2;

    // Create base (which are not deleted) objects.
    // Other objects constantly created by pipeline at update.js
    create.background();
    create.player();
    create.tractor();
    create.bison();
    create.stork();

    actions.speed.change(globalState.gameSpeed);
    animations.speed.accelerateGame();
  },

  player() {
    // Invisible, but real physic body
    globalState.player = context.physics.add.image(docCenter, docBottom - 75, 'potato').setScale(1, 1.3);
    globalState.player.setCollideWorldBounds(true);
    globalState.player.depth = 998;
    globalState.player.visible = false;

    if(globalState.platform == 'mobile' && globalState.accelerometer == false) actions.player.setDraggable();
  },

  tractor() {
    globalState.tractor = context.physics.add.image(-50, -50, 'physic-body');
    globalState.tractor.body.enable = false;
    globalState.tractor.depth = 999;
    globalState.tractor.setSize(50, 50);

    context.physics.add.overlap(globalState.player, globalState.tractor, actions.tractor.playerCollision, null, context);
  },

  bison() {
    globalState.bison = context.physics.add.image(0, -100, 'physic-body');
    globalState.bison.visible = false;
    globalState.bison.body.enable = false;
    globalState.bison.body.setSize(50, 50);
    globalState.bison.body.setOffset(0, 40);
    globalState.bison.depth = 999;
    globalState.bison.rotation = 1.5708;

    context.physics.add.overlap(globalState.player, globalState.bison, actions.bison.playerCollision, null, context);
  },

  stork() {
    globalState.stork = context.physics.add.image(-150, 150, 'physic-body');
    globalState.stork.body.setSize(40, 40);
    globalState.stork.body.setOffset(50, 0);
    globalState.stork.body.enable = false;
    globalState.stork.visible = false;
    globalState.stork.initialX = -150;
    globalState.stork.initialY = 150;
    globalState.stork.depth = 2999;
  },

  background() {
    globalState.bg = context.add.tileSprite(0, 0, window.gameWidth, window.gameHeight, 'ground').setOrigin(0, 0);
  },

  borders() {
    var props = {
      side : ''
    };

    var callback = () => {};

    if(leftOrRight % 2 == 0) {
      var x = (gameWidth / 2) - (gameWidth / 3);
      props.side = 'left';
    } else {
      var x = gameWidth - ((gameWidth / 2) - (gameWidth / 3));
      props.side = 'right';
      props.flipX = true;
    }

    var border = create.baseImgObject(x, -150, 'border', actions.handleBorder, false, props, callback);

    leftOrRight++;
  },

  popatos() {
    var randomX = randomInt(50, gameWidth - 50);

    create.baseImgObject(randomX, -150, 'potato', actions.handleBulbo);
  },

  speedUp() {
    var randomX = randomInt(50, gameWidth - 50);

    create.baseImgObject(randomX, -150, 'speedUp', actions.speedUp);
  },

  glasses() {
    var randomX = randomInt(50, gameWidth - 50);

    create.baseImgObject(randomX, -150, 'glasses', actions.glasses);
  },

  objectsPipeline(redefinedCurrentObj = false) {
    if(baseObjectsOrder[currentObjCount] == undefined) {
      currentObjCount = 0;
    }

    if(!redefinedCurrentObj) {
      var currentObj = baseObjectsOrder[currentObjCount];
    } else {
      currentObj = redefinedCurrentObj;
    }

    if(currentObj == 'potato') {
      create.popatos();
    }

    if(currentObj == 'borderLeft' || currentObj == 'borderRight') {
      create.borders();
    }

    if(currentObj == 'speedUp') {
      create.speedUp();
    }

    if(currentObj == 'glasses') {
      create.glasses();
    }

    if(currentObj == 'tractor') {
      animations.tractor.goDown();
    }

    currentObjCount++;
  },

  baseImgObject(x, y, key, handler, additionalOverlap = {}, props = false) {
    var newGameObj = context.physics.add.sprite(x, y, key);
    newGameObj.objName = key;
    newGameObj.destroyAtFinish = true;
    newGameObj.movingObj = true;

    if(props) {
      for (var propKey in props) {
        if (props.hasOwnProperty(propKey)) {
          newGameObj[propKey] = props[propKey];
        }
      }    
    }

    var tween = context.tweens.add({
      targets: newGameObj,
      duration: 4600,
      ease: 'Linear',
      repeat: 0,
      y: 1000
    });

    tween.timeScale = globalState.gameSpeed;

    newGameObj.currentTween = tween;

    context.physics.add.overlap(globalState.player, newGameObj, handler, null, context);
    context.physics.add.overlap(globalState.tractor, newGameObj, () => {
      actions.tractor.destroyObject(globalState.tractor, newGameObj);
    }, null, context);

    if(key == 'potato') {
      context.physics.add.overlap(globalState.stork, newGameObj, actions.stork.eatPotato, null, context);
    }

    if(key == 'border') {
      context.physics.add.overlap(globalState.bison, newGameObj, actions.bison.border, null, context);
    }

    if(additionalOverlap.obj) {
      context.physics.add.overlap(additionalOverlap.obj, 
                                  newGameObj, 
                                  additionalOverlap.handler, 
                                  null, 
                                  context);
    }

    var destroyCurrentTime = 0;
    var destroyTime = 4000;
    var destroyTimer;

    function destroyObj() {
      if(globalState.pauseState || globalState.gameOver) return;

      destroyCurrentTime += 16.666;
      destroyTimer = requestAnimationFrame(destroyObj);

      if(destroyCurrentTime >= destroyTime) {
        cancelAnimationFrame(destroyTimer);
        newGameObj.destroy();
      }
    }

    destroyObj();

    return newGameObj;
  }
}

export default create;