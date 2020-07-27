function fadeInPage() {
	if (!window.AnimationEvent) return;
	const fader = document.getElementById("main");
	fader.classList.add("fade-out");
}

document.addEventListener("DOMContentLoaded", function () {
	if (!window.AnimationEvent) return;

	const fader = document.getElementById("main");
	const anchors = document.getElementsByTagName("a");

	for (let idx = 0; idx < anchors.length; idx += 1) {
		if (anchors[idx].hostname !== window.location.hostname) {
			continue;
		}
		anchors[idx].addEventListener("click", function (event) {
			const anchor = event.currentTarget;
			const listener = () => {
				window.location = anchor.href;
				fader.removeEventListener("animationend", listener);
			};
			fader.addEventListener("animationend", listener);
			event.preventDefault();
			fader.classList.add("fade-out");
		});
	}
});
window.addEventListener("pageshow", function (event) {
	if (!event.persisted) return;
	document.getElementById("main").classList.remove("fade-in");
});

fadeInPage();
