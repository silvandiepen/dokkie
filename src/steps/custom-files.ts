import { download } from "../utils";
import { ISettings } from "../types";
import { join } from "path";

export const getStyles = (settings: ISettings): ISettings => {
	let styles = [];

	if (settings.theme && !settings.theme.includes("http")) {
		download(
			`https://coat.guyn.nl/css/theme/${settings.theme}.css`,
			join(settings.output, "css", "style.css")
		);
		styles.push("/css/style.css");
	}

	// If there are addable stylesheets available
	if (settings.localConfig?.add?.css)
		styles = styles.concat(settings.localConfig.add.css);

	// If there are overruling stylesheets
	if (settings.localConfig?.overrule?.css)
		styles = settings.localConfig?.overrule?.css;

	// To Embeddable link scripts
	const stylesScripts = styles
		.map(
			(s) =>
				(s = `<link rel="stylesheet" type="text/css" media='screen and (min-width: 0px)' href="${s}"/>`)
		)
		.join("");

	return {
		...settings,
		styles: stylesScripts,
	};
};

export const getScripts = (settings: ISettings): ISettings => {
	let scripts = [];
	// If there are addable stylesheets available
	if (settings.localConfig?.add?.js)
		scripts = scripts.concat(settings.localConfig.add.js);

	// If there are overruling stylesheets
	if (settings.localConfig?.overrule?.js)
		scripts = settings.localConfig.overrule.js;

	const scriptScripts = scripts
		.map(
			(s) => (s = `<script type="text/javascript" src="${s}" async></script>`)
		)
		.join("");
	return {
		...settings,
		scripts: scriptScripts,
	};
};
