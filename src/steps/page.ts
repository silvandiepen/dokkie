import { ISettings, IFile } from "../types";
import { mdToHtml, asyncForEach, writeThatFile, Handlebars } from "../utils";
import * as log from "cli-block";
import prettier from "prettier";
const ncp = require("ncp").ncp;
import { getNavigation } from "./";
const { readFile } = require("fs").promises;
import { join } from "path";

// Convert filedata to html.

export const convertDataToHtml = async (
	settings: ISettings
): Promise<ISettings> => {
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

export const filterHiddenPages = async (
	settings: ISettings
): Promise<ISettings> => {
	const files = settings.files.filter((file: IFile) =>
		file.meta.remove ? null : file
	);
	return { ...settings, files: files };
};

// Get the layouts

export const getLayout = async (settings: ISettings): Promise<ISettings> => {
	let layoutFile = "";
	if (settings.layout.includes(".hbs") || settings.layout.includes(".html")) {
		layoutFile = await readFile(
			join(process.cwd(), settings.layout)
		).then((res) => res.toString());
	} else {
		layoutFile = await readFile(
			join(__dirname, "../../", `template/${settings.layout}.hbs`)
		).then((res) => res.toString());
	}
	return { ...settings, layout: layoutFile };
};

export const createFiles = async (settings: ISettings): Promise<void> => {
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
				favicon: settings.faviconData.html.join(""),
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
export const copyFolders = async (settings: ISettings): Promise<void> => {
	if (settings.copy.length > 0) {
		log.BLOCK_MID("Copy files/folders");
		await asyncForEach(settings.copy, async (folder) => {
			await ncp(
				folder,
				settings.output + "/" + folder.split("/")[folder.split("/").length - 1],
				(err) => {
					if (!err) log.BLOCK_LINE_SUCCESS(folder);
					else console.log(err);
				}
			);
		});
	}
};
