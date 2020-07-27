const ncp = require("ncp").ncp;
const { readFile } = require("fs").promises;

import * as log from "cli-block";
import prettier from "prettier";
import { join } from "path";

import {
	ISettings,
	IFile,
	IFileContents,
	IContents,
	IToMarkdown,
} from "../types";
import {
	mdToHtml,
	asyncForEach,
	writeThatFile,
	Handlebars,
	loadHandlebarsPartials,
} from "../utils";
import { getNavigation, getItem } from "./";

export const toHtml = async (
	file: IFile | IFileContents
): Promise<IToMarkdown> => {
	const markdownData = await mdToHtml(file);
	return { meta: markdownData.meta, html: markdownData.document };
};

// Convert filedata to html.
export const convertDataToHtml = async (
	settings: ISettings
): Promise<ISettings> => {
	await asyncForEach(settings.files, async (file: IFile, idx1: string) => {
		switch (file.ext) {
			case ".md":
				file = { ...file, ...toHtml(file) };
				break;
			case ".html":
				file.meta = {};
				file.html = file.data;
				break;
		}

		// Actually convert the html for the main file.
		const rendered1 = await mdToHtml(file);
		settings.files[idx1].html = rendered1.document;
		settings.files[idx1].meta = rendered1.meta;

		// When the file has partials saved in contents, all partials also need the Markdown treatment.
		if (file.contents?.articles?.length) {
			await asyncForEach(
				file.contents.articles,
				async (subFile: IFileContents, idx2: number) => {
					const rendered2 = await mdToHtml(subFile);
					settings.files[idx1].contents.articles[idx2].html =
						rendered2.document;
					settings.files[idx1].contents.articles[idx2].meta = rendered2.meta;
				}
			);
		} // When the file has partials saved in contents, all partials also need the Markdown treatment.
		if (file.sections?.length) {
			await asyncForEach(
				file.sections,
				async (section: IContents, idx2: number) => {
					const rendered3 = await mdToHtml(section);
					settings.files[idx1].sections[idx2].html = rendered3.document;
					settings.files[idx1].sections[idx2].meta = rendered3.meta;
					if (section.articles)
						await asyncForEach(
							section.articles,
							async (subFile: IFileContents, idx3: number) => {
								const rendered4 = await mdToHtml(subFile);
								settings.files[idx1].sections[idx2].articles[idx3].html =
									rendered4.document;
								settings.files[idx1].sections[idx2].articles[idx3].meta =
									rendered4.meta;
							}
						);
				}
			);
		}
	});

	return { ...settings, files: settings.files };
};

// Filter files
export const filterHiddenPages = async (
	settings: ISettings
): Promise<ISettings> => {
	// If the file has a meta remove. Remove it.
	const files = settings.files.filter((file: IFile) =>
		file.meta?.remove ? null : file
	);

	return { ...settings, files };
};

// Get the layouts
export const getLayout = async (settings: ISettings): Promise<ISettings> => {
	try {
		let layoutFile = "";
		if (settings.layout.includes(".hbs") || settings.layout.includes(".html")) {
			try {
				layoutFile = await readFile(
					join(process.cwd(), settings.layout)
				).then((r: any): string => r.toString());
			} catch (err) {
				throw Error(err);
			}
		} else {
			try {
				layoutFile = await readFile(
					join(__dirname, "../../", `template/${settings.layout}.hbs`)
				).then((r: any): string => r.toString());
			} catch (err) {
				throw Error(err);
			}
		}
		return { ...settings, layoutFile };
	} catch (err) {
		throw new Error(err);
	}
};

export const reformInjectHtml = async (
	settings: ISettings
): Promise<ISettings> => {
	const Inject = {};
	function isLink(str: string): boolean {
		if (str.indexOf(".html") > -1) return true;
		return false;
	}
	if (settings.injectHtml) {
		await asyncForEach(Object.keys(settings.injectHtml), async (option) => {
			if (isLink(settings.injectHtml[option])) {
				try {
					Inject[option] = await readFile(settings.injectHtml[option]);
				} catch (err) {
					throw Error(err);
				}
			} else {
				Inject[option] = settings.injectHtml[option];
			}
		});
	}
	return { ...settings, injectHtml: Inject };
};

export const createPages = async (settings: ISettings): Promise<void> => {
	const partials = await loadHandlebarsPartials();
	// Register Partials
	await asyncForEach(partials, (partial) => {
		Handlebars.registerPartial(partial.name, partial.file);
	});
	const template = Handlebars.compile(settings.layoutFile);

	const getOnce = {
		logo: settings.assets?.logo ? settings.assets.logo : false,
		package: settings.package ? settings.package : false,
		favicon: settings.faviconData ? settings.faviconData.html.join("") : null,
		enhance: {
			...settings.enhance,
			search: settings.files.length > 1 ? settings.enhance.search : false,
		},
		skip: settings.skip,
		injectHtml: settings.injectHtml,
		styles: settings.styles ? settings.styles : null,
		scripts: settings.scripts ? settings.scripts : null,
	};

	!settings.logging.includes("silent") && log.BLOCK_MID("Creating pages");
	await asyncForEach(settings.files, async (file: IFile) => {
		// THe file is newer than today, so don't build it (yet).
		if (file.date > new Date()) return;
		try {
			const currentLink = file.route.replace("index.html", "");
			const contents = template({
				...getOnce,
				projectTitle:
					settings.projectTitle === ""
						? settings.package?.name
							? settings.package.name
							: file.title
						: settings.projectTitle,
				title: file.title,
				type: settings.type,
				template: settings.layout,
				content: file.html,
				currentLink,
				currentId: currentLink.replace(/\//g, " ").trim().replace(/\s+/g, "-"),
				headerNavigation: getNavigation(settings, "header"),
				sidebarNavigation: getNavigation(settings, "sidebar"),
				footerNavigation: getNavigation(settings, "footer"),
				overviewNavigation: getNavigation(settings, "overview"),
				nextItem: getItem(settings, file, "next"),
				prevItem: getItem(settings, file, "prev"),
				meta: file.meta,
				sections: file.sections,
				columns: file.contents,
				hasMeta: file.meta?.author || file.meta?.tags ? true : false,
				language: settings.language,
				url: settings.url,
				scroll: true,
			});
			await writeThatFile(
				file,
				prettier.format(contents, { parser: "html" }),
				settings
			);
		} catch (err) {
			throw Error(err);
		}
	});
};
export const copyFolders = async (settings: ISettings): Promise<void> => {
	settings.copy = settings.copy.filter((folder) => {
		if (typeof folder === "string") return true;
	});
	if (settings.copy.length > 0) {
		!settings.logging.includes("silent") && log.BLOCK_MID("Copy files/folders");
		await asyncForEach(settings.copy, async (folder) => {
			await ncp(
				folder,
				settings.output + "/" + folder.split("/")[folder.split("/").length - 1],
				(err) => {
					if (!err)
						!settings.logging.includes("silent") &&
							log.BLOCK_LINE_SUCCESS(folder);
					else throw Error(err);
				}
			);
		});
	}
};

export const createPageData = async (settings: ISettings): Promise<void> => {
	const fileData = [...settings.files].map((item) => {
		// Add combined data as data and remove the default data. The combinedata has all information of the
		// page which can be used for search.
		item.data = item.combinedData;
		delete item.path;
		delete item.ext;
		delete item.html;
		delete item.destpath;
		delete item.filename;
		delete item.contents;
		delete item.sections;
		delete item.combinedData;
		return item;
	});
	await writeThatFile(
		{
			name: "",
			title: "data.json",
			ext: ".json",
			path: "",
			destpath: join(settings.output),
			filename: "data.json",
			data: "",
			meta: {},
			html: "",
		},
		JSON.stringify(fileData),
		settings,
		true
	);
};

export const setHomePage = (settings: ISettings): ISettings => {
	const customHomePage = settings.files.find((file: IFile) => file.meta?.home);
	const hasHomePage = settings.files.find(
		(file: IFile) => file.route === "/index.html"
	);
	if (customHomePage) {
		settings.files.push({
			...customHomePage,
			route: "/index.html",
			filename: "index.html",
		});
		return settings;
	} else if (hasHomePage) {
		return settings;
	} else {
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
	}
};
