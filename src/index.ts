#!/usr/bin/env node

// Filesystem
const { readdir, readFile } = require("fs").promises;
import { basename, extname, resolve, join } from "path";
import rimraf from "rimraf";
import * as log from "cli-block";
const ncp = require("ncp").ncp;
import prettier from "prettier";

const consoleJson = (json: any) => {
	console.log(JSON.stringify(json, null, 4));
};

// Functionality
import { settings, logSettings } from "./settings";
import { ISettings, IFile, INavigation } from "./types";

import {
	writeThatFile,
	asyncForEach,
	getPageTitle,
	mdToHtml,
	makeFileName,
	makeRoute,
	makePath,
	Handlebars,
} from "./utils";

const getFileTree = async (
	dir: string,
	settings: ISettings
): Promise<IFile[]> => {
	const dirents = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		dirents.map((dirent: any) => {
			const res = resolve(dir, dirent.name);
			const ext = extname(res);
			if (
				(settings.extensions.includes(ext) || dirent.isDirectory()) &&
				!settings.excludeFolders.includes(dirent.name)
			)
				return dirent.isDirectory()
					? getFileTree(res, settings)
					: { name: basename(res).replace(ext, ""), path: res, ext: ext };
			else return null;
		})
	);
	return Array.prototype.concat(...files).filter((r) => r !== null);
};

const getFiles = async (settings: ISettings): Promise<ISettings> => {
	const files = await getFileTree(settings.input, settings);
	return { ...settings, files: files };
};

const fileData = async (settings: ISettings): Promise<ISettings> => {
	await asyncForEach(settings.files, async (file) => {
		file.data = await getFileData(file);
	});
	return { ...settings };
};

const getFileData = async (file: IFile): Promise<IFile> => {
	try {
		let fileData = await readFile(file.path).then((res) => res.toString());
		return fileData;
	} catch (err) {
		console.log(err);
	}
};

const getPackageInformation = async (
	settings: ISettings
): Promise<ISettings> => {
	try {
		let PackageData = await readFile("package.json").then((res) =>
			res.toString()
		);
		return { ...settings, package: JSON.parse(PackageData) };
	} catch (err) {
		console.log(err);
	}
	return settings;
};

// Load the local confi and show

const loadLocalConfig = async (settings: ISettings): Promise<ISettings> => {
	try {
		let configData = await readFile("dokkie.config.json").then((res) =>
			JSON.parse(res.toString())
		);
		log.BLOCK_MID("Local configuration");
		log.BLOCK_SETTINGS(configData);
		return { ...settings, localConfig: configData };
	} catch (err) {
		// console.log(err);
	}
	return settings;
};

// Set the local config to the settings

const setLocalConfig = (settings: ISettings): ISettings => {
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
		if (settings.localConfig.showNavigation)
			settings.showNavigation = settings.localConfig.showNavigation;
		if (settings.localConfig.projectTitle)
			settings.projectTitle = settings.localConfig.projectTitle;
	}

	return settings;
};
// Convert filedata to html.

const convertDataToHtml = async (settings: ISettings): Promise<ISettings> => {
	await asyncForEach(settings.files, async (file: IFile) => {
		switch (file.ext) {
			case ".md":
				const markdownData = await mdToHtml(file);
				file.meta = markdownData.meta;
				file.html = markdownData.document;
				break;
			case ".html":
				file.meta = {};
				file.html = file.data;
				break;
		}
	});
	return { ...settings, files: settings.files };
};

// Filter files

const filterHiddenPages = async (settings: ISettings): Promise<ISettings> => {
	const files = settings.files.filter((file: IFile) =>
		file.meta.remove ? null : file
	);
	return { ...settings, files: files };
};

const getLayout = async (settings: ISettings): Promise<ISettings> => {
	let layoutFile = "";
	if (settings.layout.includes(".hbs") || settings.layout.includes(".html")) {
		layoutFile = await readFile(
			join(process.cwd(), settings.layout)
		).then((res) => res.toString());
	} else {
		layoutFile = await readFile(
			join(__dirname, "../", `template/${settings.layout}.hbs`)
		).then((res) => res.toString());
	}
	return { ...settings, layout: layoutFile };
};

const setMetadata = async (settings: ISettings): Promise<ISettings> => {
	const files = await Promise.all(
		settings.files.map(
			async (file: IFile) =>
				(file = {
					...file,
					title: await getPageTitle(file),
					route: makeRoute(file, settings),
					destpath: makePath(file, settings),
					filename: makeFileName(file),
				})
		)
	).then((res) => res);

	return { ...settings, files: files };
};

const getStyles = (settings: ISettings): ISettings => {
	let styles = [];

	if (settings.theme && !settings.theme.includes("http")) {
		styles.push(`https://coat.guyn.nl/theme/${settings.theme}.css`);
	}

	// If there are addable stylesheets available
	if (settings.localConfig?.add?.stylesheets)
		styles = styles.concat(settings.localConfig.add.stylesheets);

	// If there are overruling stylesheets
	if (settings.localConfig?.overrule?.stylesheets)
		styles = settings.localConfig?.overrule?.stylesheets;

	// To Embeddable link scripts
	const stylesScripts = styles
		.map((s) => (s = `<link rel="stylesheet" type="text/css" href="${s}"/>`))
		.join("");

	return {
		...settings,
		styles: stylesScripts,
	};
};

const getScripts = (settings: ISettings): ISettings => {
	let scripts = [];
	// If there are addable stylesheets available
	if (settings.localConfig?.add?.scripts)
		scripts = scripts.concat(settings.localConfig.add.scripts);

	// If there are overruling stylesheets
	if (settings.localConfig?.overrule?.scripts)
		scripts = settings.localConfig.overrule.scripts;

	const scriptScripts = scripts
		.map((s) => (s = `<script type="text/javascript" src="${s}"></script>`))
		.join("");
	return {
		...settings,
		scripts: scriptScripts,
	};
};
const cleanFolder = async (settings: ISettings): Promise<void> => {
	if (settings.cleanBefore) rimraf.sync(settings.output);
};

const filterNavigation = (
	nav: INavigation[],
	parent: string
): INavigation[] => {
	// consoleJson(nav);
	const filteredNav = nav.map((item) => {
		// consoleJson({
		// 	name: item.name,
		// 	parent: parent,
		// 	hasMetaMenu: !item.meta?.menu,
		// });
		if (
			!item.meta?.menu ||
			(item.meta.menu && item.meta.menu.includes(parent))
		) {
			if (item.children)
				return {
					...item,
					children: filterNavigation(item.children, parent).filter(Boolean),
				};
			else {
				return { ...item };
			}
		}
	});
	return filteredNav;
};

const getNavigation = (settings: ISettings, filter: string): INavigation[] =>
	settings.showNavigation.includes(filter)
		? filterNavigation(Array.from(settings.navigation), filter).filter(Boolean)
		: [];

const createFiles = async (settings: ISettings): Promise<void> => {
	const template = Handlebars.compile(settings.layout);

	log.BLOCK_MID("Creating pages");
	await asyncForEach(settings.files, async (file: IFile) => {
		try {
			const currentLink = file.route.replace("index.html", "");
			const contents = template({
				projectTitle:
					settings.projectTitle == ""
						? settings.package.name
						: settings.projectTitle,
				title: file.title,
				content: file.html,
				currentLink: currentLink,
				currentId: currentLink.replace(/\//g, " ").trim().replace(/\s+/g, "-"),
				styles: settings.styles ? settings.styles : null,
				scripts: settings.scripts ? settings.scripts : null,
				package: settings.package ? settings.package : null,
				navigation: settings.navigation,
				headerNavigation: getNavigation(settings, "header"),
				sidebarNavigation: getNavigation(settings, "sidebar"),
				footerNavigation: getNavigation(settings, "footer"),
			});
			await writeThatFile(file, prettier.format(contents, { parser: "html" }));
		} catch (err) {
			console.log(err);
		}
	});
};
const copyFolders = async (settings: ISettings): Promise<void> => {
	if (settings.copy.length > 0) {
		log.BLOCK_MID("Copy folders");
		await asyncForEach(settings.copy, async (folder) => {
			await ncp(folder, settings.output + "/" + folder, (err) => {
				if (!err) log.BLOCK_LINE_SUCCESS(folder);
			});
		});
	}
};
const start = async (settings: ISettings): Promise<ISettings> => {
	return settings;
};

const buildNavigation = async (settings: ISettings): Promise<ISettings> => {
	let nav: INavigation[] = [];

	settings.files.forEach((file: IFile) => {
		const link = file.route.replace("index.html", "");
		const linkPath = link.substr(1, link.length - 2).split("/");
		const parent = linkPath[linkPath.length - 2]
			? linkPath[linkPath.length - 2]
			: "";
		if (!file.meta.hide)
			nav.push({
				name: file.title,
				link: link,
				path: linkPath,
				self: linkPath[linkPath.length - 1],
				parent: file.meta.parent
					? file.meta.parent.split(",").map((i: string) => i.trim())
					: parent,
				meta: file.meta,
			});
	});

	let newNav = [];

	if (!settings.flatNavigation)
		nav
			.filter((item) => item.parent == "")
			.forEach((item) => {
				newNav.push({
					...item,
					children: nav.filter(
						(subitem) => subitem.parent.includes(item.self) && item.self !== ""
					),
				});
			});
	return { ...settings, navigation: settings.flatNavigation ? nav : newNav };
};

start(settings())
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
		await createFiles(s);
		await copyFolders(s);
		return s;
	})
	.then(() => {
		setTimeout(() => {
			log.BLOCK_END("Done :)");
		}, 10);
	});
