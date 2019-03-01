import globalState from './../../globalState';
import { get } from 'https';

var getAngle = {
  degreeY : 0,
  degreeYRounded : 0,
  renderedDegreeYRounded : null,
  degreeYAccurate : 0,
  renderedDegreeYAccurate : null,
  degreeX: 0,
  degreeXRounded: 0,
  renderedDegreeXRounded: null,
  degreeXAccurate: 0,
  renderedDegreeXAccurate: null,
  APIDeviceMotion: false,
  APIDeviceOrientation: false,
  direction: 1,

  init() {
    getAngle.chooseApi();
  },

  checkDevicemotion() {
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', (e) => {
        onOrientation(e);
      }, true);
    }

    function onOrientation(e) {
      if (!(e.acceleration.x == null &&
        e.acceleration.y == null &&
        e.acceleration.z == null &&
        e.accelerationIncludingGravity.x == null &&
        e.accelerationIncludingGravity.y == null &&
        e.accelerationIncludingGravity.z == null &&
        e.rotationRate.alpha == null &&
        e.rotationRate.beta == null &&
        e.rotationRate.gamma == null)) {
        getAngle.APIDeviceMotion = true;
      }
    }
  },

  checkDeviceOrientation() {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', onOrientation, true);
    }

    function onOrientation(e) {
      if (!(e.alpha == null && e.beta == null && e.gamma == null)) {
        getAngle.APIDeviceOrientation = true;
      }
    }
  },

  chooseApi() {
    getAngle.checkDevicemotion();
    getAngle.checkDeviceOrientation();

    setTimeout(() => {
      if (getAngle.APIDeviceOrientation || getAngle.APIDeviceMotion) {
        getAngle.setListeners();
        globalState.accelerometer = true;
      } else {
        console.log('Accelerometer not supported');
        globalState.accelerometer = false;

        var accelerometerNotSupportedEvent = new CustomEvent('accelerometerNotSupported');

        document.dispatchEvent(accelerometerNotSupportedEvent);
      }

      var event = new Event('detectAccelerometerSupporting');

      window.dispatchEvent(event);

      if (getAngle.API == 'deviceMotion') {
        inaccurate.show();
      }
    }, 500);
  },

  setListeners() {
    if (getAngle.APIDeviceOrientation) {
      window.addEventListener('deviceorientation', (e) => {
        getAngle.setByOrientationAPI(e);
      }, true);
    } else {
      window.addEventListener('devicemotion', (e) => {
        getAngle.setByMotionAPI(e);
      }, true);
    }
  },

  setByOrientationAPI(e) {
    getAngle.degreeY = e.beta;
    getAngle.degreeYRounded = Math.round(getAngle.degreeY);
    getAngle.degreeYAccurate = getAngle.degreeY.toFixed(1);

    getAngle.degreeX = e.gamma;
    getAngle.degreeXRounded = Math.round(getAngle.degreeX);
    getAngle.degreeXAccurate = getAngle.degreeX.toFixed(1);
  },

  setByMotionAPI(e) {
    var magicConvertingNumber = 9.155645981688708;

    getAngle.degreeY = e.accelerationIncludingGravity.y * magicConvertingNumber;
    getAngle.degreeYRounded = Math.round(getAngle.degreeY);
    getAngle.degreeYAccurate = getAngle.degreeY.toFixed(1);

    getAngle.degreeX = e.accelerationIncludingGravity.x * -magicConvertingNumber;
    getAngle.degreeXRounded = Math.round(getAngle.degreeX);
    getAngle.degreeXAccurate = getAngle.degreeX.toFixed(1);
  }
}

export default getAngle;