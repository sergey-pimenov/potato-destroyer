import globalState from './../../../globalState';

export default function() {
  // Player that visible and animated, but haven't physical body.
  // This because DragonBones object haven't any integration at Phaser's physical engine
  globalState.playerAnimated = this.add.armature('bee');
  globalState.playerAnimated.animation.play('walk');
  globalState.playerAnimated.x = window.gameWidth;
  globalState.playerAnimated.y = window.gameHeight * 2 - 160;
  globalState.playerAnimated.yInitial = globalState.playerAnimated.y;
  globalState.playerAnimated.scaleX = 0.8;
  globalState.playerAnimated.scaleY = 0.8;
  globalState.playerAnimated.depth = 999;

  globalState.bisonAnimated = this.add.armature('bison');
  globalState.bisonAnimated.animation.play('animtion0');
  globalState.bisonAnimated.visible = false;
  globalState.bisonAnimated.x = -200;
  globalState.bisonAnimated.y = -200;
  globalState.bisonAnimated.rotation = -1.5708;
  globalState.bisonAnimated.scaleX = 2;
  globalState.bisonAnimated.scaleY = 2;

  globalState.tractorAnimated = this.add.armature('tractor');
  globalState.tractorAnimated.animation.play('animtion0');
  globalState.tractorAnimated.visible = false;
  globalState.tractorAnimated.x = -200;
  globalState.tractorAnimated.y = -200;
  globalState.tractorAnimated.scaleX = 1.5;
  globalState.tractorAnimated.scaleY = 1.5;

  globalState.storkAnimated = this.add.armature('stork');
  globalState.storkAnimated.animation.play('animtion0');
  globalState.storkAnimated.visible = false;
  globalState.storkAnimated.x = -200;
  globalState.storkAnimated.y = -200;
  globalState.storkAnimated.scaleX = 1.5;
  globalState.storkAnimated.scaleY = 1.5;

  // Negative substrate for health
  globalState.healthItemSubstrate = this.add.sprite(gameWidth - 15, 30, 'healthSubstrate');
  globalState.healthItemSubstrate.depth = 1000;
  globalState.healthItemSubstrate._displayOriginX = 350;
  globalState.healthItemSubstrate.displayWidth = 150;
  globalState.healthItemSubstrate.displayHeight = 47 / 1.5;
  globalState.healthItemSubstrate.alpha = 0;

  // Health
  globalState.healthItem = this.add.sprite(gameWidth - 15, 30, 'health');
  globalState.healthItem.depth = 1000;
  globalState.healthItem._displayOriginX = 350;
  globalState.healthItem.displayWidth = 150;
  globalState.healthItem.displayHeight = 47 / 1.5;
  globalState.healthItem.alpha = 0;

  // Health mask
  globalState.healthMask = this.make.sprite({
    x: gameWidth - 15,
    y: 30,
    key: 'healthMask',
    add: false
  });

  globalState.healthMask.depth = 1000;
  globalState.healthMask._displayOriginX = 350;
  globalState.healthMask.displayWidth = 150;
  globalState.healthMask.displayHeight = 47 / 1.5;
  globalState.healthItem.mask = new Phaser.Display.Masks.BitmapMask(this, globalState.healthMask);

  globalState.scoresEl = this.add.bitmapText(window.gameWidth - 190, 15, 'font', '0', 39).setOrigin(1, 0);
  globalState.scoresEl.depth = 1000;
  globalState.scoresEl.alpha = 0;
}