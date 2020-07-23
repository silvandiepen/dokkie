// import favicons from "favicons";
import Iconator from "iconator";
import { ISettings } from "../types";
import { createImage } from "./";

// import Frame from "canvas-to-buffer";
import { join } from "path";
import { IOutput as IFaviconData } from "iconator/src/types";

const createFaviconImage = async (settings: ISettings): Promise<string> => {
	const image = await createImage({
		size: {
			width: 1200,
			height: 1200,
		},
		text: "default",
		background: "#fff",
		textSettings: {
			fontSize: 70,
			fontWeight: "bold",
			fontFamily: "Menlo",
			align: "center",
			baseline: "top",
			color: "#ff0000",
		},
	});
	return image;

	// const frame = new Frame(canvas, {});
	// const frameBuffer = frame.toBuffer()!;
	// return frameBuffer.toString();
};

export const createFavicons = async (
	settings: ISettings
): Promise<ISettings> => {
	if (settings.skip.includes("favicons")) return settings;

	const source = settings.assets?.favicon
		? settings.assets.favicon
		: await createFaviconImage(settings);

	const faviconDest = "img/favicons";

	const faviconData = await Iconator({
		input: source,
		output: join(settings.output, faviconDest),
		appName: settings.package?.name,
		appDescription: settings.package?.description,
		appDeveloper: settings.package?.author,
		appDeveloperUrl: null,
		color: "white",
		themeColor: "black",
		destination: faviconDest,
		appleStatusBarStyle: "default",
		logging: ["inline", "minimal"],
		url: settings.url,
	} as any).then(async (r: IFaviconData) => r);

	return { ...settings, faviconData };
};
