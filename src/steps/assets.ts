import { ISettings } from "../types";
const { readFile, writeFile, mkdir, stat } = require("fs").promises;
import { join, basename, dirname } from "path";
import { download, createFolder } from "../utils";
import { asyncForEach } from "cli-block";
import * as log from "cli-block";

const downloadImage = async (
	image: string,
	settings: ISettings
): Promise<void> => {
	try {
		let imageFile = "";

		const filePath = join(
			process.cwd(),
			settings.output,
			"img",
			basename(image)
		);
		await mkdir(dirname(filePath), { recursive: true });

		if (image.includes("http")) {
			await download(image, filePath).then(async () => {
				if (settings.debug) {
					const stats = await stat(filePath);
					console.log(stats);
				}
			});
		} else {
			imageFile = await readFile(image);
			await writeFile(filePath, imageFile).then(async () => {
				if (settings.debug) {
					const stats = await stat(filePath);
					console.log(stats);
				}
			});
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
	log.BLOCK_MID("Assets");
	await createFolder(join(settings.output, "/img"));

	// Process Assets
	if (settings.assets.logo)
		await downloadImage(settings.assets.logo, settings).then(() => {
			const filename = "/img/" + basename(settings.assets.logo);
			settings.assets.logo = filename;
			log.BLOCK_LINE_SUCCESS(filename);
		});

	// Process Content images
	function filenameFromUrl(str: string): string {
		return str.split("/")[str.split("/").length - 1];
	}

	if (contentImages && !settings.skip.includes("download"))
		await asyncForEach(contentImages, async (img) => {
			await downloadImage(img.image, settings).then(() => {
				const filename = "/img/" + filenameFromUrl(img.image);
				settings.files[img.fileIdx].html = settings.files[
					img.fileIdx
				].html.replace(img.image, filename);
				log.BLOCK_LINE_SUCCESS(filename);
			});
		});

	return settings;
};
