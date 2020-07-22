function fadeInPage() {
	if (!window.AnimationEvent) {
		return;
	}
	var fader = document.getElementById("fader");
	fader.classList.add("fade-out");
}

document.addEventListener("DOMContentLoaded", function () {
	if (!window.AnimationEvent) {
		return;
	}

	var anchors = document.getElementsByTagName("a");

	for (var idx = 0; idx < anchors.length; idx += 1) {
		if (anchors[idx].hostname !== window.location.hostname) {
			continue;
		}

		anchors[idx].addEventListener("click", function (event) {
			var fader = document.getElementById("fader"),
				anchor = event.currentTarget;

			var listener = function () {
				window.location = anchor.href;
				fader.removeEventListener("animationend", listener);
			};
			fader.addEventListener("animationend", listener);

			event.preventDefault();
			fader.classList.add("fade-in");
		});
	}
});

window.addEventListener("pageshow", function (event) {
	if (!event.persisted) {
		return;
	}
	var fader = document.getElementById("fader");
	fader.classList.remove("fade-in");
});

/*
 * Set random colors to differentiate reloaded pages.
 */
document.addEventListener("DOMContentLoaded", function () {
	var color = [255 * Math.random(), 255 * Math.random(), 255 * Math.random()],
		inverse = color.map(function (c) {
			return 255 - c;
		}),
		link = document.getElementById("link");
	document.body.style.background = "rgb(" + color.join(", ") + ")";
	link.style.color = "rgb(" + inverse.join(", ") + ")";
});