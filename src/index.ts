#!/usr/bin/env node

// Filesystem
const { readdir, readFile } = require("fs").promises;
import { basename, extname, resolve, join } from "path";
import rimraf from "rimraf";
import * as log from "cli-block";

// Functionality
import { settings } from "./settings";
import { ISettings, IFile } from "./types";
import Handlebars from "handlebars";
import {
	writeThatFile,
	asyncForEach,
	getTitle,
	mdToHtml,
	buildNavigation,
	makeFileName,
	makeRoute,
	makePath,
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

const fileData = async (settings: ISettings): Promise<any> => {
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

const toHtml = async (settings: ISettings): Promise<ISettings> => {
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

const getLayout = async (settings: ISettings): Promise<ISettings> => {
	let layoutFile = "";
	if (settings.layout.includes(".html")) {
		layoutFile = await readFile(
			join(process.cwd(), settings.layout)
		).then((res) => res.toString());
	} else {
		layoutFile = await readFile(
			join(__dirname, "../", `template/${settings.layout}.html`)
		).then((res) => res.toString());
	}
	return { ...settings, layout: layoutFile };
};

const createFolder = (settings: ISettings): ISettings => {
	if (settings.cleanBefore) rimraf.sync(settings.output);
	return settings;
};

const setMeta = async (settings: ISettings): Promise<ISettings> => {
	const files = await Promise.all(
		settings.files.map(
			async (file: IFile) =>
				(file = {
					...file,
					title: await getTitle(file),
					route: makeRoute(file, settings),
					destpath: makePath(file, settings),
					filename: makeFileName(file),
				})
		)
	).then((res) => res);

	return { ...settings, files: files };
};

const createFiles = async (settings: ISettings): Promise<ISettings> => {
	const template = Handlebars.compile(settings.layout);
	log.BLOCK_START("Files");
	await asyncForEach(settings.files, async (file: IFile) => {
		try {
			const contents = template({
				title: file.title,
				content: file.html,
				style: settings.style,
				navigation: buildNavigation(settings),
			});
			await writeThatFile(file, contents);
		} catch (err) {
			console.log(err);
		}
	});

	return settings;
};

const setStylesheet = (settings: ISettings): ISettings => {
	return {
		...settings,
		style: `https://coat.guyn.nl/theme/${settings.theme}.css`,
	};
};

getFiles(settings())
	.then((s) => {
		log.START("Creating Your documentation");
		return s;
	})
	.then(fileData)
	.then(toHtml)
	.then(setMeta)
	.then(getLayout)
	.then(setStylesheet)
	.then(createFolder)
	.then(createFiles)
	.then(() => {
		log.BLOCK_END("Done :)");
		console.log();
	});
