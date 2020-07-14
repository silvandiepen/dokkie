#!/usr/bin/env node

// Filesystem
import * as log from "cli-block";

// Functionality
import {
	settings,
	setAlternativeDefaults,
	getDokkiePackage,
	defaultSettings,
} from "./settings";
import { ISettings } from "./types";
import { createFavicons, downloadAssets, PurgeCSSFiles } from "./utils";

import {
	getFiles,
	setFileDate,
	fileData,
	concatPartials,
	sectionPartials,
	cleanupFilePathAfterOrder,
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
	createPages,
	createPageData,
	copyFolders,
	getLayout,
	setHomePage,
	reformInjectHtml,
	showDist,
} from "./steps";

const buildDokkie = async (s: ISettings): Promise<ISettings> => s;

buildDokkie(settings())
	.then(getDokkiePackage)
	.then((s) => {
		if (!s.logging.includes("silent")) {
			log.START("Creating Your documentation");
			log.BLOCK_START();
			log.BLOCK_LINE(
				`Dokkie (${s.dokkie.version}) is now building your documentation`
			);
		}
		return s;
	})
	.then(setAlternativeDefaults)
	.then(loadLocalConfig)
	.then(setLocalConfig)
	.then((s) => {
		!s.logging.includes("silent") && log.BLOCK_MID("Settings");

		const filteredSettings = {};
		Object.keys(s).forEach((key) =>
			s[key] !== defaultSettings[key] ? (filteredSettings[key] = s[key]) : false
		);

		!s.logging.includes("silent") &&
			s.logging.includes("debug") &&
			log.BLOCK_SETTINGS(s.logging.includes("debug") ? s : filteredSettings, {
				exclude: ["dokkie"],
			});
		return s;
	})
	.then(getFiles)
	.then(fileData)
	.then(concatPartials)
	.then(sectionPartials)
	.then(cleanupFilePathAfterOrder)
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
		await createPages(s);
		await copyFolders(s);
		createPageData(s);
		return s;
	})
	.then(async (s) => {
		await PurgeCSSFiles(s);
		setTimeout(() => {
			!s.logging.includes("silent") && log.BLOCK_END("Done :)");
			showDist(s);
		}, 10);
	});
