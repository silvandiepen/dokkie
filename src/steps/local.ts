const { readFile } = require("fs").promises;
import { ISettings } from "../types";
import * as log from "cli-block";

export const getPackageInformation = async (
	settings: ISettings
): Promise<ISettings> => {
	try {
		const PackageData = await readFile("package.json").then((res) =>
			res.toString()
		);
		return { ...settings, package: JSON.parse(PackageData) };
	} catch (err) {
		// throw Error(err);
	}
	return settings;
};

// Load the local confi and show

export const loadLocalConfig = async (
	settings: ISettings
): Promise<ISettings> => {
	try {
		const configData = await readFile(settings.config).then((res) =>
			JSON.parse(res.toString())
		);
		if (!settings.logging.includes("silent")) {
			log.BLOCK_MID("Local configuration");
			log.BLOCK_SETTINGS(configData);
		}
		return { ...settings, localConfig: configData };
	} catch (err) {
		// throw Error(err);
	}
	return settings;
};

// Set the local config to the settings

export const setLocalConfig = (settings: ISettings): ISettings => {
	if (settings.localConfig) {
		Object.keys(settings.localConfig).forEach((key) => {
			switch (key) {
				case "showNavigation":
					settings.showNavigation = settings.localConfig.showNavigation.map(
						(option) => {
							if (typeof option === "string") {
								return {
									name: option,
									mobile: true,
									desktop: true,
								};
							} else return option;
						}
					);
					break;
				case "add":
					if (settings.localConfig.add?.excludeFolders)
						settings.excludeFolders = settings.excludeFolders.concat(
							settings.localConfig.add.excludeFolders
						);
					break;
				default:
					settings[key] = settings.localConfig[key];
					break;
			}
		});
	}

	return settings;
};
