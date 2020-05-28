#!/usr/bin/env node

// Filesystem
const { readdir, readFile } = require("fs").promises;
import { basename, extname, resolve } from "path";
import rimraf from "rimraf";

// Functionality
import { settings } from "./settings";
import { ISettings, IFile } from "./types";
import Handlebars from "handlebars";
import { writeThatFile, asyncForEach, getTitle, mdToHtml } from "./utils";

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
	// return files;
	return Array.prototype.concat(...files).filter((r) => r !== null);
};

const getFiles = async (settings: ISettings): Promise<ISettings> => {
	const files = await getFileTree(settings.input, settings);

	console.log(files);
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
	const layoutFile = await readFile(
		`template/${settings.layout}.html`
	).then((res) => res.toString());
	return { ...settings, layout: layoutFile };
};

const createFolder = (settings: ISettings): ISettings => {
	if (settings.cleanBefore) rimraf.sync(settings.output);
	return settings;
};

const createFiles = async (settings: ISettings): Promise<ISettings> => {
	const template = Handlebars.compile(settings.layout);
	await asyncForEach(settings.files, async (file: IFile) => {
		try {
			const contents = template({
				title: getTitle(file),
				content: file.html,
				style: settings.style,
			});
			await writeThatFile(file, contents, settings);
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
	.then(fileData)
	.then(toHtml)
	.then(getLayout)
	.then(setStylesheet)
	.then(createFolder)
	.then(createFiles)
	.then(() => console.log("Congrats, you've build your docs!"));
