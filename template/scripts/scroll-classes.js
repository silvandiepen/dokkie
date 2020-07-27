let previousY = 0;

const handleScroll = () => {
	currentY = window.scrollY;
	const bodyClass = document.body.classList;
	// On top or not
	if (window.scrollY < 1) {
		bodyClass.add("on-top");
		bodyClass.remove("off-top");
	} else {
		bodyClass.add("off-top");
		bodyClass.remove("on-top");
	}
	// Scrolling down/up
	if (currentY < previousY) {
		console.log("hoiiii");
		bodyClass.add("scroll-down");
		bodyClass.remove("scroll-up");
	} else if (currentY > previousY) {
		console.log("doeiiii");
		bodyClass.add("scroll-up");
		bodyClass.remove("scroll-down");
	}
	previousY = window.scrollY;
};
handleScroll();
window.addEventListener("scroll", handleScroll);
