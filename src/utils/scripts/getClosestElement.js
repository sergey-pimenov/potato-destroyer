export default function(x, y, elements = []) {
  var inputElementDistance = x + y;
  var closestElement = elements[0];

  elements.forEach(element => {
    var distance = inputElementDistance - element.x + element.y;
    var closestElementDistance = inputElementDistance - closestElement.x + closestElement.y;
    
    if(distance < closestElementDistance) {
      closestElement = element;
    }
  });

  return closestElement;
}