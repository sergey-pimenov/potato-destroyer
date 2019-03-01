// Disable focus after mouse click
// From: https://www.darrenlester.com/blog/focus-only-on-tab
export default function focusOnlyWithKeys() {
	let mouseDown = false;

	var focusableNodes = document.querySelectorAll('button, a, .swiper-pagination-bullet');

	for( var i = 0; i < focusableNodes.length; i++) {
		focusableNodes[i].addEventListener('mousedown', () => {
		  mouseDown = true;
		});

		focusableNodes[i].addEventListener('mouseup', () => {
		  mouseDown = false;
		});

		focusableNodes[i].addEventListener('focus', (event) => {
			console.log(event.target)

		  if (mouseDown) {
		    event.target.blur();
		  }
		});
	}
}