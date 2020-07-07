// import favicons from "favicons";
import Iconator from "iconator";
import { ISettings } from "../types";
import * as log from "cli-block";
const { createCanvas } = require("canvas");
import Frame from "canvas-to-buffer";
import { join } from "path";
import { IOutput as IFaviconData } from "iconator/src/types";

const createFaviconImage = (settings: ISettings): string => {
	const canvas = createCanvas(1024, 1024);
	const ctx = canvas.getContext("2d");
	// Draw line under text
	ctx.font = "800px Helvetica";
	let firstLetter = ("" ? settings.package.name : settings.projectTitle).substr(
		0,
		1
	);
	ctx.fillStyle = "#7f7f7f"; // Most mid-color, so it will always be visible.
	ctx.fillText(firstLetter, 200, 768);
	const frame = new Frame(canvas);
	return frame.toBuffer();
};

export const createFavicons = async (
	settings: ISettings
): Promise<ISettings> => {
	if (settings.skip.includes("favicons")) return settings;

	const source = settings.assets?.favicon
		? settings.assets.favicon
		: createFaviconImage(settings);
	log.BLOCK_MID("Create Favicon");

	const faviconDest = "img/favicons";
	const faviconData = await Iconator({
		input: source,
		output: join(settings.output, faviconDest),
		appName: settings.package?.name,
		appDescription: settings.package?.description,
		appDeveloper: settings.package?.author,
		appDeveloperUrl: null,
		debug: false,
		color: "white",
		themeColor: "black",
		destination: faviconDest,
		appleStatusBarStyle: "default",
	} as any).then(async (r: IFaviconData) => r);

	return { ...settings, faviconData: faviconData };
};
