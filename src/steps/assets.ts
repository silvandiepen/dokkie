import { ISettings } from "../types";
const { readFile, writeFile, mkdir } = require("fs").promises;
import { join, basename, dirname } from "path";

const downloadImage = async (
	image: string,
	settings: ISettings
): Promise<void> => {
	try {
		const imageFile = await readFile(image);
		const filePath = join(
			__dirname,
			"../../",
			settings.output,
			"img",
			basename(image)
		);
		await mkdir(dirname(filePath), { recursive: true });
		await writeFile(filePath, imageFile);
	} catch (err) {
		console.error(err);
	}
};
export const downloadAssets = async (
	settings: ISettings
): Promise<ISettings> => {
	if (!settings.assets) return settings;

	if (settings.assets.logo)
		await downloadImage(settings.assets.logo, settings).then(() => {
			settings.assets.logo = "/img/" + basename(settings.assets.logo);
		});

	return settings;
};
