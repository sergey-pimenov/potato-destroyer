var cacheName = 'app_serviceworker_v_4';

var cacheUrls = [
  '/',
  '/manifest.json',
  '/content/en.json',
  '/content/by.json',
  '/content/ru.json',
  '/dragonBones/bee/bee_ske.dbbin',
  '/dragonBones/bee/bee_tex.json',
  '/dragonBones/bee/bee_tex.png',
  '/dragonBones/bison/bison_ske.dbbin',
  '/dragonBones/bison/bison_tex.json',
  '/dragonBones/bison/bison_tex.png',
  '/dragonBones/stork/stork_ske.dbbin',
  '/dragonBones/stork/stork_tex.json',
  '/dragonBones/stork/stork_tex.png',
  '/dragonBones/tractor/tractor_ske.dbbin',
  '/dragonBones/tractor/tractor_tex.json',
  '/dragonBones/tractor/tractor_tex.png',
  '/font/font.fnt',
  '/font/font.png',
  '/font/font-2.json',
  '/font/font-2.png',
  '/scripts/dragonBones.js',
  '/scripts/index.js',
  '/scripts/phaser.js',
  '/scripts/PhaserBones.js',
  '/styles/index.css',
  '/img/about.svg',
  '/img/addToHome.svg',
  '/img/bg-3.jpg',
  '/img/border.png',
  '/img/borders.png',
  '/img/cancel.svg',
  '/img/close.png',
  '/img/downArrow.svg',
  '/img/fb.png',
  '/img/github.png',
  '/img/glasses.png',
  '/img/ground.jpg',
  '/img/icon.png',
  '/img/install.svg',
  '/img/iosActions.svg',
  '/img/lifeIndicator.png',
  '/img/lifeIndicatorSubstrate.png',
  '/img/loader.png',
  '/img/menu.png',
  '/img/pause.png',
  '/img/physic-body.png',
  '/img/potato.png',
  '/img/qrcode.svg',
  '/img/rotatePhone.png',
  '/img/speedUp.png',
  '/img/tw.png',
  '/img/vk.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(cacheUrls);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request));
});