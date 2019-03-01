export default function() {

  function detectVersion() {
    // From https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
    navigator.browserVersion = (function(){
      var ua= navigator.userAgent, tem, 
      M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
      if(/trident/i.test(M[1])){
          tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
          return 'IE '+(tem[1] || '');
      }
      if(M[1]=== 'Chrome'){
          tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
          if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
      M= M[2]? [M[1], M[2]]: [navigator.appVersion];
      if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
      return M.join('');
    })();

    document.body.dataset.browser = navigator.browserVersion.replace(/\d+/g, '').toLowerCase().trim();
    document.body.dataset.version = navigator.browserVersion.replace(/\D/g,'').trim();
  }

  detectVersion();
}