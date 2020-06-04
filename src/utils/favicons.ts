import favicons from "favicons";
import { ISettings } from "../types";
import * as log from "cli-block";
import { join, basename, extname } from "path";
import { asyncForEach, writeThatFile } from "../utils";

// import * as log from "cli-block";
export const createFavicons = async (settings: ISettings): Promise<void> => {
	const source = settings.favicon ? settings.favicon : "test.jpg";

	console.log(source);

	const config = {
		path: "/", // Path for overriding default icons path. `string`
		appName: settings.package?.name, // Your application's name. `string`
		appDescription: settings.package?.description, // Your application's description. `string`
		developerName: settings.package?.author, // Your (or your developer's) name. `string`
		developerURL: null, // Your (or your developer's) URL. `string`
		dir: "auto", // Primary text direction for name, short_name, and description
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
			appleStartup: false, // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
			coast: false, // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
			favicons: true, // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
			firefox: true, // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
			windows: true, // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
			yandex: true, // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
		},
	};
	log.BLOCK_MID("Create Favicon");

	await favicons(source, config as any, async (error, response) => {
		if (error) {
			console.log(error.message); // Error description e.g. "An unknown error has occurred"
			return;
		}
		const faviconDest = "img/favicons";
		const fileDest = "img/favicons";
		const htmlDest = "img/html";

		await asyncForEach(response.images, async (img) => {
			await writeThatFile(
				{
					name: img.name,
					path: join(settings.output, "img/favicons", img.name),
					destpath: join(settings.output, "/img/favicons/"),
					filename: img.name,
					title: basename(img.name),
					ext: extname(img.name),
					route: join("img/favicons/", img.name),
				},
				img.contents,
				true
			);
		});
		await asyncForEach(response.files, async (img) => {
			await writeThatFile(
				{
					name: img.name,
					path: join(settings.output, "img/favicons", img.name),
					destpath: join(settings.output, "/img/favicons/"),
					filename: img.name,
					title: basename(img.name),
					ext: extname(img.name),
					route: join("img/favicons/", img.name),
				},
				img.contents,
				true
			);
		});

		// console.log(response.images); // Array of { name: string, contents: <buffer> }
		// console.log(response.files); // Array of { name: string, contents: <string> }
		// console.log(response.html); // Array of strings (html elements)
	});
};
