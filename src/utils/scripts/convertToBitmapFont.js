export default function convertToBitmapFont(input = '', imageUrl = '', scale = 1, textData) {
  var output = '';

  if(input === undefined) {
    throw new Error('Input is undefined');
  }

  if(typeof(input) !== 'string') {
    throw new TypeError('Input text must have "string" type');
  }

  for(var i = 0; i < input.length; i++) {
    var textDataObj;
    var letter = input[i];
    var charCode = input.charCodeAt(i);

    textData.forEach(element => {
      if(element.id == charCode) {
        textDataObj = element;
      }
    });

    var yTranslate = 0;

    if(textDataObj.yTranslate) yTranslate = textDataObj.yTranslate;

    var domLetter = `
        <span class="item letter"
              style="display: inline-block;
                     width:${textDataObj.width * scale}px;
                     height:${textDataObj.height * scale}px;
                     position: relative;">
          <span style="background-image: url(${imageUrl});
                background-position: ${-textDataObj.x + parseInt(textDataObj.xoffset, 10)}px 
                                    ${-textDataObj.y}px;
                width:${textDataObj.width}px;
                height:${textDataObj.height}px;
                transform: scale(${scale});
                transform-origin: 0 0;
                display: flex;
                position: absolute;
                left: 0;
                top: ${parseInt(textDataObj.yTranslate, 10)}px">
              <span style="color: transparent;
                           width:${textDataObj.width}px;
                           height:${textDataObj.height}px;
                           z-index: 3;
                           position: absolute;
                           transform: translateY(-${parseInt(textDataObj.yTranslate, 10) * 4}px});
                           display: inline-flex;
                           align-items: flex-end;
                           left: 0;
                           line-height: 1;
                           font-family: sans-serif;
                           font-size: 65px;">
                  ${letter}
              </span>
          </span>
        </span>
      `;

      if(charCode == 32) {
      output += `<span class="item split">&nbsp</span>`;
    } else {
      output += domLetter;
    }
  }

  var textWrapper = document.createElement('div');
  textWrapper.innerHTML = output;

  var outputNode = document.createElement('div');

  var elements = textWrapper.childNodes;
  elements = Array.prototype.slice.call(elements);

  var word = '';
  var wrapper;
  var resultWrapper = document.createElement('div');

  elements.forEach(element => {
    if(element.classList && element.classList.contains('item')) {
      word += element.outerHTML;
      wrapper = document.createElement('div');
      wrapper.innerHTML = word;

      wrapper.classList.add('wordWrapper');
    }

    if(element.classList && element.classList.contains('split') || !element.nextSibling) {
      resultWrapper.innerHTML += wrapper.outerHTML;
      resultWrapper.classList.add('wordsWrapper');
  
      word = '';
      wrapper = document.createElement('div');
    }
  });

    return resultWrapper.outerHTML;
}