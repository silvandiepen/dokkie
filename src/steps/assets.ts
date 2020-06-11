import { ISettings } from "../types";
const { readFile, writeFile, mkdir } = require("fs").promises;
import { join, basename, dirname } from "path";
import { download } from "../utils";
import { asyncForEach } from "cli-block";

const downloadImage = async (
	image: string,
	settings: ISettings
): Promise<void> => {
	try {
		let imageFile = "";

		const filePath = join(
			__dirname,
			"../../",
			settings.output,
			"img",
			basename(image)
		);
		await mkdir(dirname(filePath), { recursive: true });

		if (image.includes("http")) {
			await download(image, filePath);
		} else {
			imageFile = await readFile(image);
			await writeFile(filePath, imageFile);
		}
	} catch (err) {
		console.error(err);
	}
};
export const downloadAssets = async (
	settings: ISettings
): Promise<ISettings> => {
	// Get images from content
	const contentImages = [];
	const imageRegex = new RegExp('<img src="(.*?)"[^>]+>');

	if (!settings.skip.includes("download"))
		settings.files.forEach((file, index) => {
			let images = file.html.match(imageRegex);
			if (images)
				images.forEach((img) => {
					if (!img.includes("<img"))
						contentImages.push({
							fileIdx: index,
							image: img,
						});
				});
		});

	// If there arent any image. Do nothing.
	if (!settings.assets && contentImages.length < 1) return settings;

	// Process Assets
	if (settings.assets.logo)
		await downloadImage(settings.assets.logo, settings).then(() => {
			settings.assets.logo = "img/" + basename(settings.assets.logo);
		});

	// Process Content images
	function filenameFromUrl(str: string): string {
		return str.split("/")[str.split("/").length - 1];
	}

	if (contentImages && !settings.skip.includes("download"))
		await asyncForEach(contentImages, async (img) => {
			await downloadImage(img.image, settings).then(() => {
				settings.files[img.fileIdx].html = settings.files[
					img.fileIdx
				].html.replace(img.image, "img/" + filenameFromUrl(img.image));
			});
		});

	return settings;
};
