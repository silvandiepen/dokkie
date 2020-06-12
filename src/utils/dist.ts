import { ISettings } from "../types";
import { getFileTree } from "../steps";
import * as log from "cli-block";
export const showDist = async (settings: ISettings): Promise<void> => {
	if (settings.debug) {
		log.BLOCK_START("All files");

		const files = await getFileTree(settings.output, {
			...settings,
			extensions: ["*"],
		}).then((r) => r);

		files.forEach((file) => {
			log.BLOCK_LINE(file.path.replace(process.cwd(), ""));
		});
		log.BLOCK_END();
	}
};
