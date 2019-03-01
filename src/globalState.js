// Template for global state
var globalState = {
  platform: null,
  lang: 'en',
  region: null,
  playOnMobileAlertWasClosed: false,
  gameBooted: false,
  gameStarded: false,
  gameOver: false,
  gameTime: 0,
  accelerometer: false,
  resolution: 1,
  health: 100,
  maxScores: 0,
  scores: 0,
  scoresAll: [],
  scoresEl: null,
  healthMask: null,
  healthItem: '',
  pause: '',
  pauseState: false,
  player: null,
  playerAnimated: null,
  tractor: null,
  stork: null,
  bg: null,
  gameSpeed: 0.65, // 0.65 - init game speed
  gameAccelerationTween: false,
  context: null
}

export default globalState;