#!/usr/bin/env node

// Filesystem
import * as log from "cli-block";

// Functionality
import { settings, setAlternativeDefaults, getDokkiePackage } from "./settings";
import { ISettings } from "./types";
import { createFavicons } from "./utils";

import {
	getFiles,
	setFileDate,
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
	setHomePage,
	reformInjectHtml,
	downloadAssets,
} from "./steps";

import { showDist } from "./utils/dist";

const buildDokkie = async (settings: ISettings): Promise<ISettings> => {
	return settings;
};

buildDokkie(settings())
	.then(getDokkiePackage)
	.then((s) => {
		log.START("Creating Your documentation");
		log.BLOCK_START();
		log.BLOCK_LINE(
			`Dokkie (${s.dokkie.version}) is now building your documentation`
		);
		return s;
	})
	.then(setAlternativeDefaults)
	.then(loadLocalConfig)
	.then(setLocalConfig)
	.then((s) => {
		log.BLOCK_MID("Settings");
		log.BLOCK_SETTINGS(s, { exclude: ["dokkie"] });
		return s;
	})
	.then(getFiles)
	.then(fileData)
	.then(getPackageInformation)
	.then(convertDataToHtml)
	.then(filterHiddenPages)
	.then(setMetadata)
	.then(getLayout)
	.then(setFileDate)
	.then(setHomePage)
	.then(reformInjectHtml)
	.then(buildNavigation)
	.then(async (s) => {
		await cleanFolder(s);
		return s;
	})
	.then(getStyles)
	.then(getScripts)
	.then(createFavicons)
	.then(downloadAssets)
	.then(async (s) => {
		await showDist(s);
		await createFiles(s);
		await copyFolders(s);
		return s;
	})
	.then((s) => {
		setTimeout(() => {
			log.BLOCK_END("Done :)");
			showDist(s);
		}, 10);
	});
