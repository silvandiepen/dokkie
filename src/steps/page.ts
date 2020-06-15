import { ISettings, IFile } from "../types";
import {
	mdToHtml,
	asyncForEach,
	writeThatFile,
	Handlebars,
	loadHandlebarsPartials,
} from "../utils";
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
	try {
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
	} catch (err) {
		throw new Error(err);
	}
};

export const reformInjectHtml = async (
	settings: ISettings
): Promise<ISettings> => {
	let Inject = {};
	function isLink(str: string): Boolean {
		if (str.indexOf(".html") > -1) return true;
		return false;
	}
	if (settings.injectHtml) {
		await asyncForEach(Object.keys(settings.injectHtml), async (option) => {
			if (isLink(settings.injectHtml[option])) {
				try {
					Inject[option] = await readFile(settings.injectHtml[option]);
				} catch (err) {
					console.error(err);
				}
			} else {
				Inject[option] = settings.injectHtml[option];
			}
		});
	}
	return { ...settings, injectHtml: Inject };
};

export const createFiles = async (settings: ISettings): Promise<void> => {
	const partials = await loadHandlebarsPartials();

	// Register Partials
	await asyncForEach(partials, (partial) => {
		Handlebars.registerPartial(partial.name, partial.file);
	});
	const template = Handlebars.compile(settings.layout);

	const getOnce = {
		logo: settings.assets?.logo ? settings.assets.logo : false,
		package: settings.package ? settings.package : false,
		favicon: settings.faviconData ? settings.faviconData.html.join("") : null,
		enhance: settings.enhance,
		skip: settings.skip,
		injectHtml: settings.injectHtml,
		styles: settings.styles ? settings.styles : null,
		scripts: settings.scripts ? settings.scripts : null,
	};

	log.BLOCK_MID("Creating pages");
	await asyncForEach(settings.files, async (file: IFile) => {
		// THe file is newer than today, so don't build it (yet).
		if (file.date < new Date()) return;
		try {
			const currentLink = file.route.replace("index.html", "");
			const contents = template({
				...getOnce,
				projectTitle:
					settings.projectTitle == ""
						? settings.package?.name
							? settings.package.name
							: file.title
						: settings.projectTitle,
				title: file.title,
				content: file.html,
				currentLink: currentLink,
				currentId: currentLink.replace(/\//g, " ").trim().replace(/\s+/g, "-"),
				headerNavigation: getNavigation(settings, "header"),
				sidebarNavigation: getNavigation(settings, "sidebar"),
				footerNavigation: getNavigation(settings, "footer"),
				overviewNavigation: getNavigation(settings, "overview"),
			});
			await writeThatFile(file, prettier.format(contents, { parser: "html" }));
		} catch (err) {
			console.log(err);
		}
	});
};
export const copyFolders = async (settings: ISettings): Promise<void> => {
	settings.copy = settings.copy.filter((folder) => {
		if (typeof folder === "string") return true;
	});
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

export const setHomePage = (settings: ISettings): ISettings => {
	const hasHomePage = settings.files.find(
		(file: IFile) => file.route === "/index.html"
	);
	if (hasHomePage) return settings;

	settings.files.push({
		name: "home",
		path: "",
		ext: ".md",
		date: new Date(),
		data: "",
		meta: { title: "home", hide: true },
		html: "",
		title: "Home",
		route: "/index.html",
		destpath: settings.output,
		filename: "index.html",
	});

	return settings;
};
