import { download } from "../utils";
import { ISettings } from "../types";
import { join } from "path";
const { readFile } = require("fs").promises;

export const getStyles = async (settings: ISettings): Promise<ISettings> => {
	let styles = [];
	let localCss = false;

	if (settings.theme && !settings.theme.includes("http")) {
		await download(
			`https://coat.guyn.nl/css/theme/${settings.theme}.css`,
			join(process.cwd(), settings.output, "css", "style.css")
		);
		styles.push("/css/style.css");
		localCss = true;
	}

	// If there are addable stylesheets available
	if (settings.localConfig?.add?.css)
		styles = styles.concat(settings.localConfig.add.css);

	// If there are overruling stylesheets
	if (settings.localConfig?.overrule?.css)
		styles = settings.localConfig?.overrule?.css;

	// To Embeddable link scripts
	let stylesScripts = styles
		.map(
			(s) =>
				(s = `<link rel="stylesheet" type="text/css" media='screen and (min-width: 0px)' href="${s}"/>`)
		)
		.join("");

	// Load preconnect for Google fonts
	if (localCss) {
		try {
			let file = await readFile(
				join(process.cwd(), settings.output, "css", "style.css")
			);
			if (file.indexOf("https://fonts.googleapis.com/") > -1)
				stylesScripts =
					stylesScripts +
					'<link rel="preconnect" href="https://fonts.gstatic.com" />';
		} catch (err) {
			console.log(err);
		}
	}

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
