import globalState from './../../../globalState';
import preload from './preload';
import create from './create';

export default function() {
  globalState.subLayerResolution = 2;

  var config = {
    type: Phaser.WEBGL,
    width: gameWidth,
    height: gameHeight,
    canvas: document.querySelector('.subLayer'),
    resolution: globalState.subLayerResolution,
    disableContextMenu: true,
    zoom: 1,
    transparent: true,
    powerPreference: 'high-performance',
  
    banner: {
      hidePhaser: true,
    },

    scene: {
      preload: preload,
      create: create
    },

    plugins: {
      global: [
          { 
            key: "DragonBonesPlugin",
            plugin: dragonBones.phaser.plugin.DragonBonesPlugin, 
            start: true 
          }
      ]
    }
  };

  window.subLayer = new Phaser.Game(config);
  window.subLayerContext = this;
}