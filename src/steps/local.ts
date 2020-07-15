const { readFile } = require("fs").promises;
import { ISettings } from "../types";
import * as log from "cli-block";

export const getPackageInformation = async (
	settings: ISettings
): Promise<ISettings> => {
	try {
		let PackageData = await readFile("package.json").then((res) =>
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
		let configData = await readFile(settings.config).then((res) =>
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
		if (settings.localConfig.input) settings.input = settings.localConfig.input;
		if (settings.localConfig.output)
			settings.output = settings.localConfig.output;
		if (settings.localConfig.layout)
			settings.layout = settings.localConfig.layout;
		if (settings.localConfig.cleanBefore)
			settings.cleanBefore = settings.localConfig.cleanBefore;
		if (settings.localConfig.theme) settings.theme = settings.localConfig.theme;
		if (settings.localConfig.extensions)
			settings.extensions = settings.localConfig.extensions;
		if (settings.localConfig.excludeFolders)
			settings.excludeFolders = settings.localConfig.excludeFolders;
		if (settings.localConfig.copy) settings.copy = settings.localConfig.copy;
		if (settings.localConfig.strip) settings.strip = settings.localConfig.strip;
		if (settings.localConfig.flatNavigation)
			settings.flatNavigation = settings.localConfig.flatNavigation;
		if (settings.localConfig.skip) settings.skip = settings.localConfig.skip;
		if (settings.localConfig.showNavigation)
			settings.showNavigation = settings.localConfig.showNavigation.map(
				(option) => {
					if (typeof option == "string") {
						return {
							name: option,
							mobile: true,
							desktop: true,
						};
					} else return option;
				}
			);
		if (settings.localConfig.injectHtml)
			settings.injectHtml = settings.localConfig.injectHtml;
		if (settings.localConfig.projectTitle)
			settings.projectTitle = settings.localConfig.projectTitle;
		if (settings.localConfig.type) settings.type = settings.localConfig.type;
		if (settings.localConfig.extendNavigation)
			settings.extendNavigation = settings.localConfig.extendNavigation;
		if (settings.localConfig.overruleNavigation)
			settings.overruleNavigation = settings.localConfig.overruleNavigation;
		if (settings.localConfig.assets)
			settings.assets = settings.localConfig.assets;
		if (settings.localConfig.logging)
			settings.logging = settings.localConfig.logging;
		if (settings.localConfig.showHome)
			settings.showHome = settings.localConfig.showHome;
		if (settings.localConfig.add?.excludeFolders)
			settings.excludeFolders = settings.excludeFolders.concat(
				settings.localConfig.add.excludeFolders
			);
	}

	return settings;
};
