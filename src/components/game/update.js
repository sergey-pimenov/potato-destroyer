import globalState from './../../globalState';
import create from './create';
import animations from './animations';
import movePlayer from './movePlayer';

/////// Setup & timing of object creations ///////
var basicInterval = 700; // Base interval between any object creation

var speedUpInterval = 9000;

/* DISABLED
var glassesInterval = 12000;
var glassesDelay = 3000;
*/

var storkInterval = 15000;
var storkDelay = 0;

var tractorInterval = 12000;

var bisonDelay = 6000;
var bisonInterval = 12000;
/////// Sorry for this shit ///////

var updateCurrentTime;
var timeScale;
var currentInterval;

var update = {
  currentIntervalTime: 0,

  gameOjects : {
    totalSpeedUpCount: 1,
    totalGlassesCount: 1,
    totalTractorCount: 1,
    totalBisonCount: 1,
    totalStorkCount: 1
  },

  reset() {
    update.currentIntervalTime = 0;

    for(var index in update.gameOjects) { 
      update.gameOjects[index] = 1; 
    }
  },

  step() {
    if(movePlayer.selectedInterface !== false && !globalState.gameOver) {
      movePlayer.selectedInterface();
      movePlayer.update();
    }
    
    globalState.bg.tilePositionY -= 4.15 * globalState.gameSpeed;
  
    if(globalState.gameOver) return;
    if(!globalState.gameStarded) return;
  
    timeScale = 1;
  
    if(globalState.gameSpeed != 1 && globalState.gameSpeed > 1) {
      timeScale = 1 - (globalState.gameSpeed - 1) * 0.6;
    }
  
    currentInterval = basicInterval * timeScale;
  
    update.currentIntervalTime += 16.666;
    globalState.gameTime += 16.666;
  
    if(update.currentIntervalTime >= currentInterval) {
      update.currentIntervalTime = 0;
      
      if(globalState.gameTime / speedUpInterval >= update.gameOjects.totalSpeedUpCount) {
        create.objectsPipeline('speedUp');
        update.gameOjects.totalSpeedUpCount++;
      } else if(globalState.gameTime / tractorInterval >= update.gameOjects.totalTractorCount) {
        if(update.gameOjects.totalTractorCount % 2 == 0) {
          animations.tractor.goDown('left');
        } else {
          animations.tractor.goDown('right');
        }
        update.gameOjects.totalTractorCount++;
      } else if((globalState.gameTime - bisonDelay) / bisonInterval >= update.gameOjects.totalBisonCount) {
        animations.bison.goDown();
        update.gameOjects.totalBisonCount++;
      } else if((globalState.gameTime - storkDelay) / storkInterval >= update.gameOjects.totalStorkCount) {
        animations.stork.goRight();
        update.gameOjects.totalStorkCount++;
      } else {
        create.objectsPipeline();
      }
      // DISABLED //
      // else if((globalState.gameTime - glassesDelay) / glassesInterval >= update.gameOjects.totalGlassesCount) {
      //   create.objectsPipeline('glasses');
      //   update.gameOjects.totalGlassesCount++;
      // }
    }
  }
}

export default update;