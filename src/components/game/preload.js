export default function preload () {
  this.load.image('ground', '../img/ground.jpg');
  this.load.image('speedUp', '../img/speedUp.png');
  this.load.image('border', '../img/border.png');
  this.load.image('physic-body', '../img/physic-body.png');
  this.load.image('potato', '../img/potato.png');

  this.load.on('complete', function () {
    document.body.classList.add('hidePreloader');
  });
}