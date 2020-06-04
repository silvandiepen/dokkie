import { ISettings } from "../types";

export const getStyles = (settings: ISettings): ISettings => {
	let styles = [];

	if (settings.theme && !settings.theme.includes("http")) {
		styles.push(`https://coat.guyn.nl/theme/${settings.theme}.css`);
	}

	// If there are addable stylesheets available
	if (settings.localConfig?.add?.stylesheets)
		styles = styles.concat(settings.localConfig.add.stylesheets);

	// If there are overruling stylesheets
	if (settings.localConfig?.overrule?.stylesheets)
		styles = settings.localConfig?.overrule?.stylesheets;

	// To Embeddable link scripts
	const stylesScripts = styles
		.map((s) => (s = `<link rel="stylesheet" type="text/css" href="${s}"/>`))
		.join("");

	return {
		...settings,
		styles: stylesScripts,
	};
};

export const getScripts = (settings: ISettings): ISettings => {
	let scripts = [];
	// If there are addable stylesheets available
	if (settings.localConfig?.add?.scripts)
		scripts = scripts.concat(settings.localConfig.add.scripts);

	// If there are overruling stylesheets
	if (settings.localConfig?.overrule?.scripts)
		scripts = settings.localConfig.overrule.scripts;

	const scriptScripts = scripts
		.map((s) => (s = `<script type="text/javascript" src="${s}"></script>`))
		.join("");
	return {
		...settings,
		scripts: scriptScripts,
	};
};
