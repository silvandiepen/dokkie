import { download } from "../utils";
import { ISettings } from "../types";
import { join } from "path";
const { readFile, writeFile } = require("fs").promises;

const fixGoogleFonts = async (settings: ISettings): Promise<string[]> => {
	try {
		const links = [];
		let file = await readFile(
			join(process.cwd(), settings.output, "css", "style.css")
		).then((r) => r.toString());

		// If there is a google font, automatically add preconnect for gstattic
		if (file.indexOf("https://fonts.googleapis.com/") > -1)
			links.push(
				'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>'
			);

		// Replace Import for css for Link elements.
		const importRegex = new RegExp(/@import.*?[\"\']([^\"\']+)[\"\'].*?;/gi);
		const matches = file.match(importRegex);

		if (matches)
			matches.forEach((match: string) => {
				file = file.replace(match, "");
				links.push(
					`<link rel="stylesheet" type="text/css" href="${
						match.replace(/'/g, '"').match(/"([^']+)"/)[1]
					}" />`
				);
			});

		await writeFile(
			join(process.cwd(), settings.output, "css", "style.css"),
			file
		);

		return links;
	} catch (err) {
		throw Error(err);
	}
};
export const getStyles = async (settings: ISettings): Promise<ISettings> => {
	let styles = [];
	let localCss = false;

	if (settings.theme && !settings.theme.includes("http")) {
		try {
			await download(
				`https://coat.guyn.nl/css/theme/${settings.theme}.css`,
				join(process.cwd(), settings.output, "css", "style.css")
			);
			styles.push(`${settings.url ? settings.url : ""}/css/style.css`);
			localCss = true;
		} catch (err) {
			throw Error(err);
		}
	}

	// If there are addable stylesheets available
	if (settings.localConfig?.add?.css)
		styles = styles.concat(settings.localConfig.add.css);

	// If there are overruling stylesheets
	if (settings.localConfig?.overrule?.css)
		styles = settings.localConfig?.overrule?.css;

	// To Embeddable link scripts
	const stylesScripts = styles.map(
		(s) =>
			(s = `<link rel="stylesheet" type="text/css" media='screen and (min-width: 0px)' href="${s}"/>`)
	);
	// Load preconnect for Google fonts
	if (localCss) {
		const links = await fixGoogleFonts(settings);
		if (links.length) links.forEach((link) => stylesScripts.push(link));
	}

	return {
		...settings,
		styles: stylesScripts.join(""),
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
