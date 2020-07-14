import { ISettings, IFile, IFileContents, IContents } from "../types";
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

export const toHtml = async (file: IFile | IFileContents) => {
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
		// When the file has partials saved in contents, all partials also need the Markdown treatment.
		if (file.contents?.articles?.length) {
			await asyncForEach(
				file.contents.articles,
				async (subFile: IFileContents, idx2: number) => {
					const rendered = await mdToHtml(subFile);
					settings.files[idx1].contents.articles[idx2].html = rendered.document;
					settings.files[idx1].contents.articles[idx2].meta = rendered.meta;
				}
			);
		} // When the file has partials saved in contents, all partials also need the Markdown treatment.
		if (file.sections?.length) {
			await asyncForEach(
				file.sections,
				async (section: IContents, idx2: number) => {
					const rendered = await mdToHtml(section);
					settings.files[idx1].sections[idx2].html = rendered.document;
					settings.files[idx1].sections[idx2].meta = rendered.meta;
					// settings.files[idx1].sections[idx2] = {
					// 	...settings.files[idx1].sections[idx2],
					// 	...toHtml(section),
					// };
					console.log(section);
					if (section.articles)
						await asyncForEach(
							section.articles,
							async (subFile: IFileContents, idx3: number) => {
								const rendered = await mdToHtml(subFile);
								settings.files[idx1].sections[idx2].articles[idx3].html =
									rendered.document;
								settings.files[idx1].sections[idx2].articles[idx3].meta =
									rendered.meta;
								// settings.files[idx1].sections[idx2].articles[idx3] = {
								// 	...settings.files[idx1].sections[idx2].articles[idx3],
								// 	...toHtml(subFile),
								// };
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
	return { ...settings, files: files };
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
				console.log(err);
			}
		} else {
			try {
				layoutFile = await readFile(
					join(__dirname, "../../", `template/${settings.layout}.hbs`)
				).then((r: any): string => r.toString());
			} catch (err) {
				console.log(err);
			}
		}
		return { ...settings, layoutFile: layoutFile };
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
		enhance: settings.enhance,
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
					settings.projectTitle == ""
						? settings.package?.name
							? settings.package.name
							: file.title
						: settings.projectTitle,
				title: file.title,
				type: settings.type,
				template: settings.layout,
				content: file.html,
				currentLink: currentLink,
				currentId: currentLink.replace(/\//g, " ").trim().replace(/\s+/g, "-"),
				headerNavigation: getNavigation(settings, "header"),
				sidebarNavigation: getNavigation(settings, "sidebar"),
				footerNavigation: getNavigation(settings, "footer"),
				overviewNavigation: getNavigation(settings, "overview"),
				meta: file.meta,
				sections: file.sections ? file.sections : false,
				contents: file.contents ? file.contents : false,
				hasMeta: file.meta?.author || file.meta?.tags ? true : false,
				language: settings.language,
				search: settings.files.length > 1 ? settings.search : false,
			});
			await writeThatFile(
				file,
				prettier.format(contents, { parser: "html" }),
				settings
			);
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
		!settings.logging.includes("silent") && log.BLOCK_MID("Copy files/folders");
		await asyncForEach(settings.copy, async (folder) => {
			await ncp(
				folder,
				settings.output + "/" + folder.split("/")[folder.split("/").length - 1],
				(err) => {
					if (!err)
						!settings.logging.includes("silent") &&
							log.BLOCK_LINE_SUCCESS(folder);
					else console.log(err);
				}
			);
		});
	}
};

export const createPageData = async (settings: ISettings): Promise<void> => {
	const file = {
		name: "",
		title: "",
		ext: ".json",
		path: "",
		destpath: join(settings.output),
		filename: "data.json",
	};
	const fileData = [...settings.files].map((item) => {
		delete item.path;
		delete item.ext;
		delete item.html;
		delete item.destpath;
		delete item.filename;
		return item;
	});
	await writeThatFile(file, JSON.stringify(fileData), settings, true);
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
