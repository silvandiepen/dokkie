#!/usr/bin/env node

// Filesystem
import * as log from "cli-block";

// Functionality
import { settings, logSettings } from "./settings";
import { ISettings } from "./types";
import { createFavicons } from "./utils";

import {
	getFiles,
	fileData,
	getPackageInformation,
	loadLocalConfig,
	setLocalConfig,
	getStyles,
	getScripts,
	cleanFolder,
	buildNavigation,
	convertDataToHtml,
	filterHiddenPages,
	setMetadata,
	createFiles,
	copyFolders,
	getLayout,
} from "./steps";

const buildDokkie = async (settings: ISettings): Promise<ISettings> => {
	return settings;
};

buildDokkie(settings())
	.then((s) => {
		log.START("Creating Your documentation");
		log.BLOCK_START();
		log.BLOCK_LINE("Dokkie is now building your documentation");
		return s;
	})
	.then(loadLocalConfig)
	.then(setLocalConfig)
	.then((s) => {
		logSettings(s);
		return s;
	})
	.then(getFiles)
	.then(fileData)
	.then(getPackageInformation)
	.then(convertDataToHtml)
	.then(filterHiddenPages)
	.then(setMetadata)
	.then(getLayout)
	.then(getStyles)
	.then(getScripts)
	.then(buildNavigation)
	.then(async (s) => {
		await cleanFolder(s);
		return s;
	})
	.then(createFavicons)
	.then(async (s) => {
		await createFiles(s);
		await copyFolders(s);
		return s;
	})
	.then(() => {
		setTimeout(() => {
			log.BLOCK_END("Done :)");
		}, 10);
	});
