import { ISettings, IFile } from "../types";
const { readFile, writeFile, mkdir, stat } = require("fs").promises;
import { join, basename, dirname } from "path";
import { download, createFolder, asyncForEach } from "./";
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
		await createFolder(dirname(filePath));
		if (image.includes("http")) {
			await download(image, filePath).then(async () => {
				if (settings.logging.includes("debug")) {
					const stats = await stat(filePath);
					log.BLOCK_SETTINGS(stats);
				}
			});
		} else {
			imageFile = await readFile(image).then((r: any): string => r.toString());

			await writeFile(filePath, imageFile).then(async () => {
				if (settings.logging.includes("debug")) {
					const stats = await stat(filePath);
					log.BLOCK_SETTINGS(stats);
				}
			});
		}
	} catch (err) {
		throw Error(err);
	}
};
export const downloadAssets = async (
	settings: ISettings
): Promise<ISettings> => {
	// Get images from content
	const contentImages = [];
	const imageRegex = new RegExp('<img src="(.*?)"[^>]+>');

	if (!settings.skip.includes("download"))
		try {
			settings.files.forEach((file: IFile, index: number) => {
				const images = file.html.match(imageRegex);
				if (images)
					images.forEach((img) => {
						if (!img.includes("<img"))
							contentImages.push({
								fileIdx: index,
								image: img,
							});
					});
			});
		} catch (err) {
			throw Error(err);
		}
	// If there arent any image. Do nothing.
	if (!settings.assets && contentImages.length < 1) return settings;

	!settings.logging.includes("silent") && log.BLOCK_MID("Assets");
	await createFolder(join(settings.output, "/img"));

	// Process Assets
	if (settings.assets?.logo)
		try {
			await downloadImage(settings.assets.logo, settings).then(() => {
				const filename = "/img/" + basename(settings.assets.logo);
				settings.assets.logo = filename;

				!settings.logging.includes("silent") &&
					log.BLOCK_LINE_SUCCESS(filename);
			});
		} catch (err) {
			throw Error(err);
		}
	// Process Content images
	function filenameFromUrl(str: string): string {
		return str.split("/")[str.split("/").length - 1];
	}

	if (contentImages && !settings.skip.includes("download"))
		try {
			await asyncForEach(contentImages, async (img) => {
				await downloadImage(img.image, settings).then(() => {
					const filename = `${settings.url}/img/${filenameFromUrl(img.image)}`;
					settings.files[img.fileIdx].html = settings.files[
						img.fileIdx
					].html.replace(img.image, filename);
					!settings.logging.includes("silent") &&
						log.BLOCK_LINE_SUCCESS(filename);
				});
			});
		} catch (err) {
			!settings.logging.includes("silent") &&
				log.BLOCK_LINE_ERROR(
					`Couldn\'t download ${err.message.match(/'([^']+)'/)[1]}`
				);
		}
	return settings;
};
