import { ISettings } from "../types";
import { getFileTree } from ".";
import * as log from "cli-block";
export const showDist = async (settings: ISettings): Promise<void> => {
	return;
	// if (settings.logging.includes("debug")) {
	// 	!settings.logging.includes("silent") && log.BLOCK_START("All files");

	// 	const files = await getFileTree(settings.output, {
	// 		...settings,
	// 		extensions: ["*"],
	// 	}).then((r) => r);

	// 	files.forEach((file) => {
	// 		!settings.logging.includes("silent") &&
	// 			log.BLOCK_LINE(file.path.replace(process.cwd(), ""));
	// 	});
	// 	!settings.logging.includes("silent") && log.BLOCK_END();
	// }
};
