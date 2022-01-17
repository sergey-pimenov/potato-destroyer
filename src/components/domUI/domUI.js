import screenfull from 'screenfull';
import actions from './../game/actions';
import globalState from './../../globalState';
import getData from './../../utils/scripts/getData';
import convertToBitmapFont from './../../utils/scripts/convertToBitmapFont';

// Don't do like I'am. This was very painfull
// I had to eat a lot of shit while I was doing the UI

var domUINode = document.querySelector('.domUI');

var domUI = {
  state: {
    menuShowed: false,
    disableTouchEvents: false,
  },

  domUINode: null,
  actionsBarNode: null,
  pauseButtonNode: null,
  resumeButtonNode: null,
  restartButtonNode: null,
  aboutButtonNode: null,
  dragTooltipNode: null,
  startNode: null,
  shareNode: null,
  shareCloseEvent: null,
  iosMessageNode: null,
  closeIOSInstructionNode: null,
  installAlertNode: null,
  closePlayOnMobileNode: null,
  content: null,
  font: null,
  recordsNodes: [],
  deferredPWAPrompt: null,

  setNodes() {
    domUI.domUINode = document.querySelector('.domUI');
    domUI.actionsBarNode = document.querySelector('.actionsBar');
    domUI.pauseButtonNode = document.querySelector('.pauseButton');
    domUI.resumeButtonNode = document.querySelector('.resumeButton');
    domUI.startNode = document.querySelector('.startButton');
    domUI.restartButtonNode = document.querySelector('.restartButton');
    domUI.aboutButtonNodes = document.querySelectorAll('.aboutButton');
    domUI.dragTooltipNode = document.querySelector('.dragTooltip');
    domUI.hideButtonNode = document.querySelector('.hideAboutButton');
    domUI.installButtonNodes = document.querySelectorAll('.installButton');
    domUI.installAlertNode = document.querySelector('.installAlert');
    domUI.shareNode = document.querySelector('.share');
    domUI.shareButtonNode = document.querySelectorAll('.shareButton');
    domUI.iosMessageNode = document.querySelector('.iosMessage');
    domUI.closeIOSInstructionNode = document.querySelector('.iosInstruction .close');
    domUI.recordsNodes = document.querySelectorAll('.recordData');
    domUI.closePlayOnMobileNode = document.querySelector('.closePlayOnMobile');
  },

  setListeners() {
    domUI.pauseButtonNode.addEventListener('click', () => {
      if(!domUI.state.disableTouchEvents) {
        domUI.disableTouchEvents();
        actions.pause();
        domUI.showMenu();
      }
    });

    domUI.pauseButtonNode.addEventListener('touchstart', () => {
      if(!domUI.state.disableTouchEvents) {
        domUI.disableTouchEvents();
        actions.pause();
        domUI.showMenu();
      }
    });

    domUI.startNode.addEventListener('click', () => {
      actions.startGame();
      domUI.hideMenu();
      domUI.domUINode.classList.add('gameStarted');
      
      if (screenfull.enabled) {
        screen.orientation.lock("portrait-primary");
      }
    });

    domUI.startNode.addEventListener('touchend', () => {
      actions.startGame();
      domUI.hideMenu();
      domUI.domUINode.classList.add('gameStarted');
      
      if (screenfull.enabled) {
        screen.orientation.lock("portrait-primary");
      }
    });

    domUI.resumeButtonNode.addEventListener('click', () => {
      actions.resume();
      domUI.hideMenu();

      if (screenfull.enabled) {
        screen.orientation.lock("portrait-primary");
      }
    });

    domUI.resumeButtonNode.addEventListener('touchend', () => {
      actions.resume();
      domUI.hideMenu();

      if (screenfull.enabled) {
        screen.orientation.lock("portrait-primary");
      }
    });

    domUI.restartButtonNode.addEventListener('click', () => {
      actions.restartGame();
      domUI.hideRestartWindow();

      if (screenfull.enabled) {
        screen.orientation.lock("portrait-primary");
      }
    });

    domUI.restartButtonNode.addEventListener('touchend', () => {
      actions.restartGame();
      domUI.hideRestartWindow();

      if (screenfull.enabled) {
        screen.orientation.lock("portrait-primary");
      }
    });

    domUI.shareButtonNode.forEach(element => {
      element.addEventListener('touchend', () => {
        if(!domUI.state.disableTouchEvents) {
          domUI.disableTouchEvents();
          domUI.showSharing();
        }
      });

      element.addEventListener('click', () => {
        if(!domUI.state.disableTouchEvents) {
          domUI.disableTouchEvents();
          domUI.showSharing();
        }
      });
    });

    domUI.aboutButtonNodes.forEach(element => {
      element.addEventListener('click', () => {
        if(!domUI.state.disableTouchEvents) {
          domUI.disableTouchEvents();
          domUI.showAbout();
        }
      });

      element.addEventListener('touchstart', () => {
        if(!domUI.state.disableTouchEvents) {
          domUI.disableTouchEvents();
          domUI.showAbout();
        }
      });
    });

    document.addEventListener('fullscreenchange', () => {
      if(!document.fullscreenElement) {
        domUI.showMenu();
        actions.pause();
      }
    })

    domUI.hideButtonNode.addEventListener('click', () => {
      if(!domUI.state.disableTouchEvents) {
        domUI.disableTouchEvents();
        domUI.hideAbout();
      }
    });

    domUI.hideButtonNode.addEventListener('touchstart', () => {
      if(!domUI.state.disableTouchEvents) {
        domUI.disableTouchEvents();
        domUI.hideAbout();
      }
    });

    domUI.installButtonNodes.forEach(installButtonNode => {
      installButtonNode.addEventListener('click', () => {
        if(!domUI.state.disableTouchEvents) {
          domUI.disableTouchEvents();
          domUI.installGame();
        }
      });
  
      installButtonNode.addEventListener('touchend', () => {
        if(!domUI.state.disableTouchEvents) {
          domUI.disableTouchEvents();
          domUI.installGame();
        }
      });
    });

    if(domUI.closePlayOnMobileNode) {
      domUI.closePlayOnMobileNode.addEventListener('touchstart', () => {
        if(!domUI.state.disableTouchEvents) {
          domUI.closePlayOnMobile();
        }
      });
  
      domUI.closePlayOnMobileNode.addEventListener('click', () => {
        if(!domUI.state.disableTouchEvents) {
          domUI.closePlayOnMobile();
        }
      });
    }

    domUI.installAlertNode.addEventListener('touchend', () => {
      domUI.removeHighLightInstall();
    });

    domUI.installAlertNode.addEventListener('click', () => {
      domUI.removeHighLightInstall();
    });

    domUI.closeIOSInstructionNode.addEventListener('click', () => {
      if(!domUI.state.disableTouchEvents) {
        domUI.disableTouchEvents();
        domUI.hideIOSInstruction();
      }
    });

    domUI.iosMessageNode.addEventListener('click', (e) => {
      if (e.currentTarget === e.target && !domUI.state.disableTouchEvents) {
        domUI.disableTouchEvents();
        domUI.hideIOSInstruction();
      }
    });

    document.addEventListener('keydown', (e) => {
      var keyPressed = e.keyCode;

      if(keyPressed == 27 && globalState.gameStarded && !globalState.gameOver) {
        if(domUI.state.menuShowed) {
          domUI.hideMenu();
          actions.resume();
        } else {
          domUI.showMenu();
          actions.pause();
        }
      }

      var resumeKey = keyPressed == 32 || keyPressed == 13 ? true : false;

      if(resumeKey && globalState.gameStarded && domUI.state.menuShowed && !globalState.gameOver) {
        domUI.hideMenu();
        actions.resume();
      }
    })

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      console.log('PWG ready to installation');
      document.body.classList.add('showInstallButton');
      domUI.highLightInstall();
      domUI.deferredPWAPrompt = e;
    });

    document.addEventListener('accelerometerNotSupported', () => {
      if(globalState.platform == 'mobile'){
        domUI.accelerometerNotSupportedAlert();
        domUI.dragTooltip();
      }
    });
  },

  init() {
    if(localStorage.getItem('playOnMobileAlertWasClosed')) {
      globalState.playOnMobileAlertWasClosed = true;
    }

    domUI.setupLocalisation(setupGUI); // 1. Choose localisation from En/Ru/By

    function setupGUI() {
      domUI.getContent(() => { // 2. Get localisation content
        domUI.loadFont(renderGUI); // 3. Then load bitmap font
      });
    }

    function renderGUI() { // 4. Finally render all this shit
      domUI.render();
      domUI.setNodes();
      domUI.updateData();
      domUI.setListeners();

      if(domUI.closePlayOnMobileNode) {
        domUI.closePlayOnMobileNode.focus();
      } else {
        domUI.startNode.focus();
      }

      domUI.pwaIstall(); // 5. Install PWA if it's possible
    }
  },

  setupLocalisation(callback) {
    if(localStorage.getItem('region') != null) {
      globalState.region = localStorage.getItem('region');
    } else {
      getData('https://api.freegeoip.app/json/?apikey=d5d45350-77d4-11ec-a060-dd9c2321fe97', (response) => {
        globalState.region = JSON.parse(response).country_code;

        localStorage.setItem('region', globalState.region);
      });
    }

    callback();
  },
  
  pwaIstall() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      installPromptEvent = event;
      console.log('Can be installed');
    });
  },

  getContent(callback) {
    var langToLoad = null;

    if(globalState.lang == 'RU') langToLoad = 'ru';
    if(globalState.region == 'BY') langToLoad = 'by';
    if(langToLoad == null) langToLoad = 'en';

    getData(`content/${langToLoad}.json`, (content) => {
      domUI.content = JSON.parse(content);
      callback();
    });
  },

  markup() {
    var record = '';
    var dragTooltip = '';
    var bestScores = actions.scores.getBest();
    var playOnMobile = '';

    if(actions.scores.getBest() != 0) {
      record = `
        <div class="record"> 
          Record : <span class="scores recordData"> ${bestScores} </span>
        </div>
      `;
    }

    if(globalState.platform != 'mobile' && !globalState.playOnMobileAlertWasClosed) {
      playOnMobile = domUI.playOnMobile();
    }

    var content = `
      <div class="popups">
        <div class="menu">
          ${domUI.initContent()}
        </div>

        ${domUI.share()}
        ${domUI.gameOverMarkup()}
        ${domUI.about()}
        ${domUI.iosMessage()}
      </div>

      ${playOnMobile}
    `;

    return content;
  },

  initContent() {
    var startConent = convertToBitmapFont(domUI.content.start, '../font/font-2.png', 0.3, domUI.font);
    var resumeContent = convertToBitmapFont(domUI.content.resume, '../font/font-2.png', 0.3, domUI.font);

    return `<div class="initContent" tabindex="0">
      ${domUI.actionsBar()}
      <button class="startButton"> ${startConent} </button>
      <button class="resumeButton"> ${resumeContent} </button>
      <div class="dragTooltip"></div>
    </div>`;
  },

  actionsBar() {
    var fontScale = 0.14;

    if(window.gameWidth < 360) fontScale = 0.11;
    if(globalState.platform == 'desktop') fontScale = 0.135;

    var shareButton = convertToBitmapFont(domUI.content.share.buttonName, '../font/font-2.png', fontScale, domUI.font);
    var installContent = convertToBitmapFont(domUI.content.install, '../font/font-2.png', fontScale, domUI.font);
    var installHightContent = convertToBitmapFont(domUI.content.installHighlight, '../font/font-2.png', fontScale, domUI.font);
    
    return `
      <div class="actionsBar">
        <div class="installButtonWrapper">
          <button class="installButton"> ${installContent} </button>
          <div class="installAlert"> ${installHightContent} </div>
        </div>
        <button class="shareButton"> ${shareButton}</button>
        <button class="aboutButton"></button>
      </div>
    `;
  },

  share() {
    var title = domUI.content.share.title;
    var description = domUI.content.share.description;
    var link = domUI.content.share.link;
    var img = domUI.content.share.img;
    var tags = domUI.content.share.tags;

    return `
      <div class="share">
        <a class="facebook"
           target="_blank" 
           href="https://www.facebook.com/sharer/sharer.php?t=${title}&u=${link}">
           <img width="auto" height="22px" src="img/fb.png" alt="facebook">
        </a>
        <a class="vk" 
           href="https://vk.com/share.php?url=${link}&title=${title}&image=${img}" 
           target="_blank">
          <img  width="auto" height="22px" src="img/vk.png" alt="vkontakte">
        </a>
        <a class="twitter" 
           href="https://twitter.com/intent/tweet?url=${link}"
           target="_blank" >
          <img  width="auto" height="22px" src="img/tw.png" alt="twitter">
        </a>
      </div>
    `;
  },

  about() {
    var aboutDescriptionContent = convertToBitmapFont(domUI.content.aboutDescription, '../font/font-2.png', 0.25, domUI.font);
    var sourcesContent = convertToBitmapFont(domUI.content.sources, '../font/font-2.png', 0.25, domUI.font);
    var mailContent = convertToBitmapFont(domUI.content.mail, '../font/font-2.png', 0.25, domUI.font);

    return `
      <button class="hideAboutButton"></button>

      <div class="about">
        <div class="aboutDescription">${aboutDescriptionContent}</div>

        <a class="sourcesWrapper" href="https://github.com/sergey-pimenov/potato-destroyer" target="_blank">
         <img class="githubLogo" src="img/github.png">
         <span class="sources"> ${sourcesContent} </span>
        </a>

        <a class="mail" href="mailto:pimenov.web@gmail.com">${mailContent}</a>
      </div>
    `;
  },

  gameOverMarkup() {
    var restartContent = convertToBitmapFont(domUI.content.restart, '../font/font-2.png', 0.3, domUI.font);
    var gameOverContent = convertToBitmapFont(domUI.content.gameOver, '../font/font-2.png', 0.3, domUI.font);
    var recordContent = convertToBitmapFont(domUI.content.record, '../font/font-2.png', 0.3, domUI.font);

    return `
      <div class="gameOver">
        <h2 class="title"> ${gameOverContent} </h2>

        <button class="restartButton"> ${restartContent} </button>

        <div class="record"> 
          ${recordContent} &nbsp; <span class="scores recordData">0 </span>
        </div>

        ${domUI.actionsBar()}
      </div>
    `;
  },

  updateRecords() {
    domUI.recordsNodes.forEach(element => {
      var result = '' + actions.scores.getBest();
      element.innerHTML = convertToBitmapFont(result, '../font/font-2.png', 0.3, domUI.font);
    });
  },

  iosMessage() {
    var tapConent = convertToBitmapFont(domUI.content.iosInstructions.tap, '../font/font-2.png', 0.2, domUI.font);
    var thenTapToConent = convertToBitmapFont(domUI.content.iosInstructions.thenTapTo, '../font/font-2.png', 0.2, domUI.font);

    return `
      <div class="iosMessage">
        <div class="iosInstruction">
          <button class="close"></button>
          ${tapConent} <img class="iosActionsIcon" src="img/iosActions.svg">
          ${thenTapToConent} <img class="addToHome" src="img/addToHome.svg">
        </div>
      </div>
    `;
  },

  accelerometerNotSupportedAlert() {
    // DISABLED //
    var titleContent = convertToBitmapFont(domUI.content.accelerometerNotSupportedAlert, '../font/font-2.png', 0.25, domUI.font);
    var descriptionContent = convertToBitmapFont(domUI.content.accelerometerNotSupportedDesc, '../font/font-2.png', 0.25, domUI.font);

    // document.body.innerHTML += `
    //   <div class="accelerometerNotSupportedAlert">
    //     <div class="title"> ${titleContent} </div>
    //     <div class="description"> ${descriptionContent} </div>
    //   </div>
    // `;
  },

  loadFont(callback) {
    getData('../font/font-2.json', (font) => {
      domUI.font = JSON.parse(font).chars.char;
      callback();
    });
  },

  installGame() {
    if(document.body.classList.contains('safari')) {
      domUI.showIOSInstruction();
    } else {
      domUI.deferredPWAPrompt.prompt();
      domUI.deferredPWAPrompt.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          domUI.deferredPWAPrompt = null;
          document.body.classList.remove('showInstallButton');
        });
    }
  },

  playOnMobile() {
    var titleContent = convertToBitmapFont(domUI.content.playOnMobile.title, '../font/font-2.png', 0.3, domUI.font);
    var closeButtonContent = convertToBitmapFont(domUI.content.playOnMobile.closeButton, '../font/font-2.png', 0.25, domUI.font);

    return `
      <div class="playOnMobile" tabindex="0">
        <h2 class="title"> ${titleContent} </h2>
        <img class="qrCode" src="img/qrcode.svg">
        <button class="closePlayOnMobile"> ${closeButtonContent} </button>
      </div>
    `;
  },

  showIOSInstruction() {
    domUI.domUINode.classList.add('showIOSInstruction');
  },

  dragTooltip() {
    var dragTooltipContent = convertToBitmapFont(domUI.content.dragTooltip, '../font/font-2.png', 0.16, domUI.font);
    
    domUI.dragTooltipNode.innerHTML += dragTooltipContent;
  },

  hideIOSInstruction() {
    domUI.domUINode.classList.remove('showIOSInstruction');
  },

  updateData() {
    domUI.updateRecords();
  },

  render() {
    domUINode.innerHTML += domUI.markup();
  },

  disableTouchEvents() {
    if(!domUI.state.disableTouchEvents) {
      domUI.state.disableTouchEvents = true;

      setTimeout(() => {
        domUI.state.disableTouchEvents = false;
      }, 500);
    }
  },

  showMenu() {
    domUI.domUINode.classList.remove('hideMenuTotal');

    setTimeout(() => {
      // This shit realy need, just trust me
      domUI.state.menuShowed = true;
      domUI.domUINode.classList.remove('hideMenu');
    }, 100)
  },

  showAbout() {
    domUI.domUINode.classList.add('showAbout');
  },

  hideAbout() {
    domUI.domUINode.classList.remove('showAbout');
  },

  hideMenu() {
    domUI.state.menuShowed = false;
    domUI.domUINode.classList.add('hideMenu');

    setTimeout(() => {
      // This shit realy need, just trust me
      domUI.domUINode.classList.add('hideMenuTotal');
    }, 500)
  },

  showRestartWindow() {
    domUI.updateData();
    domUI.domUINode.classList.add('gameOverState');
  },

  hideRestartWindow() {
    domUI.domUINode.classList.remove('gameOverState');
  },

  highLightInstall() {
    if(localStorage.getItem('highLightInstall') == 'wasClosed') return;
    domUI.actionsBarNode.classList.add('highLightInstall');
  },

  removeHighLightInstall() {
    localStorage.setItem('highLightInstall', 'wasClosed');
    domUI.actionsBarNode.classList.remove('highLightInstall');
  },

  showSharing() {
    domUI.domUINode.classList.add('showShare');

    setTimeout(() => {
      domUI.shareCloseEvent = domUI.domUINode.addEventListener('click', domUI.closeSharing);
    }, 100);
  },

  closeSharing(e) {
    if(e.target != domUI.shareNode || !domUI.shareNode.contains(e.target)) {
      domUI.domUINode.removeEventListener('click', domUI.closeSharing, false);
      domUI.domUINode.classList.remove('showShare');
    }
  },

  closePlayOnMobile() {
    localStorage.setItem('playOnMobileAlertWasClosed', 'true');
    
    domUI.domUINode.classList.add('playOnMobileAlertWasClosed');
    domUI.startNode.focus();
  }
};

export default domUI;