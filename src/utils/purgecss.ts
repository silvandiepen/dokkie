import PurgeCSS from "purgecss";
import { ISettings } from "../types";

export const PurgeCSSFiles = async (settings: ISettings): Promise<void> => {
	if (settings.skip.includes("purge")) return;
	const purgeCSSResults = await new PurgeCSS().purge({
		content: [`${settings.output}/**/*.html`],
		css: [`${settings.output}/**/*.css`],
	});
};
