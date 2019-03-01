export default function() {
  this.load.image('health', '../img/lifeIndicator.png');
  this.load.image('healthMask', '../img/lifeIndicator.png');
  this.load.image('healthSubstrate', '../img/lifeIndicatorSubstrate.png');
  this.load.dragonbone('bee',
  '../dragonBones/bee/bee_tex.png', 
  '../dragonBones/bee/bee_tex.json', 
  '../dragonBones/bee/bee_ske.dbbin', null, null, { responseType: "arraybuffer" });
  this.load.bitmapFont('font', '../font/font.png', '../font/font.fnt');

  this.load.dragonbone('bison',
  '../dragonBones/bison/bison_tex.png', 
  '../dragonBones/bison/bison_tex.json', 
  '../dragonBones/bison/bison_ske.dbbin', null, null, { responseType: "arraybuffer" });


  this.load.dragonbone('tractor',
  '../dragonBones/tractor/tractor_tex.png', 
  '../dragonBones/tractor/tractor_tex.json', 
  '../dragonBones/tractor/tractor_ske.dbbin', null, null, { responseType: "arraybuffer" });

  this.load.dragonbone('stork',
  '../dragonBones/stork/stork_tex.png', 
  '../dragonBones/stork/stork_tex.json', 
  '../dragonBones/stork/stork_ske.dbbin', null, null, { responseType: "arraybuffer" });

  this.load.on('complete', function () {
    var event = new CustomEvent('subSceneLoaded');

    document.dispatchEvent(event);
  });
}