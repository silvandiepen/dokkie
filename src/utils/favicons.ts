import favicons from "favicons";
import { ISettings, IFile, IFaviconImg, IFaviconResult } from "../types";
import * as log from "cli-block";
import { join, basename, extname } from "path";
import { asyncForEach, writeThatFile } from "../utils";
const { createCanvas } = require("canvas");
import Frame from "canvas-to-buffer";

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
// import * as log from "cli-block";
export const createFavicons = async (
	settings: ISettings
): Promise<ISettings> => {
	if (settings.skip.includes("favicons")) return settings;

	const source = settings.assets?.favicon
		? settings.assets.favicon
		: createFaviconImage(settings);

	const config = {
		path: "/img/favicons/", // Path for overriding default icons path. `string`
		appName: settings.package?.name, // Your application's name. `string`
		appDescription: settings.package?.description, // Your application's description. `string`
		developerName: settings.package?.author, // Your (or your developer's) name. `string`
		developerURL: null, // Your (or your developer's) URL. `string`.-
		dir: "auto", // Primary text direction for name, short_name, and description.-
		lang: "en-US", // Primary language for name and short_name
		background: "#fff", // Background colour for flattened icons. `string`
		theme_color: "#fff", // Theme color user for example in Android's task switcher. `string`
		appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
		display: "standalone", // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
		orientation: "any", // Default orientation: "any", "natural", "portrait" or "landscape". `string`
		scope: "/", // set of URLs that the browser considers within your app
		start_url: "/?homescreen=1", // Start URL when launching the application from a device. `string`
		version: settings.package?.version, // Your application's version string. `string`
		logging: false, // Print logs to console? `boolean`
		pixel_art: false, // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
		loadManifestWithCredentials: false, // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
		icons: {
			android: true, // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
			appleIcon: true, // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
			appleStartup: true, // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
			coast: true, // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
			favicons: true, // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
			firefox: true, // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
			windows: true, // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
			yandex: true, // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
		},
	};
	log.BLOCK_MID("Create Favicon");

	const faviconData = await new Promise((resolve, reject) => {
		favicons(source, config as any, async (error, response) => {
			if (error) reject(error);
			resolve(response);
		});
	}).then(async (response: IFaviconResult) => {
		const faviconDest = "img/favicons";
		const writeConfig = (img: IFaviconImg): IFile => ({
			name: img.name,
			path: join(settings.output, faviconDest, img.name),
			destpath: join(settings.output, faviconDest),
			filename: img.name,
			title: basename(img.name),
			ext: extname(img.name),
			route: join(faviconDest, img.name),
		});
		await asyncForEach(
			response.images,
			async (img: IFaviconImg): Promise<void> => {
				await writeThatFile(writeConfig(img), img.contents, true);
			}
		);
		await asyncForEach(
			response.files,
			async (img: IFaviconImg): Promise<void> => {
				await writeThatFile(writeConfig(img), img.contents, true);
			}
		);
		return response;
	});
	return { ...settings, faviconData: faviconData };
};
