// From https://www.smashingmagazine.com/2017/04/start-using-css-custom-properties/

export default function(element, varName, value) {
  if (element == null) return;
  return element.style.setProperty(`--${varName}`, value);
}