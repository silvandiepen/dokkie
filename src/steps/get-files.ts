const { readdir, readFile, stat } = require("fs").promises;
import { basename, extname, resolve, join } from "path";
import { ISettings, IFile } from "../types";
import { asyncForEach, convertToDate, lastIndex } from "../utils";
import { mdToHtml } from "../utils/markdown";
import gitlog from "gitlog";

const getGitCreationDate = async (res: any, dir: string, dirent: any) => {
	const stats = await stat(res);

	// If it's not a file, who bothers?! Just return today.
	if (!stats.isFile()) return new Date();

	const file = join(dir.replace(join(__dirname, "../../"), ""), dirent.name);

	const log = gitlog({
		repo: join(__dirname + "../../"),
		fields: ["subject", "authorName", "authorDate"] as const,
		number: 500,
	});
	const current = log.filter((logs) => logs.files.includes(file));
	let date = new Date(stats.birthtime ? stats.birthtime : null);

	if (current.length > 1) {
		const dates = [];
		current.forEach((c) => {
			dates.push(c.authorDate);
		});
		dates.sort();
		date = new Date(dates[0]);
		console.log("multiple entries:", date);
	} else if (current.length === 1) {
		date = new Date(current[0].authorDate);
		console.log("single entry:", date);
	} else {
		console.log("no entry");
	}
	return date;
};

/*
	::getFileTree
	Get all files and folders from the input
*/
export const getFileTree = async (
	dir: string,
	settings: ISettings
): Promise<IFile[]> => {
	const dirents = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		dirents.map(async (dirent: any) => {
			const res = resolve(dir, dirent.name);
			const ext = extname(res);
			// Only need the date on blog posts
			const date =
				settings.type === "blog" && dir === settings.input
					? await getGitCreationDate(res, dir, dirent)
					: new Date();

			if (
				dirent.name.includes(".git") ||
				dirent.name.includes("/dist/") ||
				dirent.name.includes("/node_modules")
			)
				return null;

			if (
				(settings.extensions.includes(ext) ||
					settings.extensions.includes("*") ||
					dirent.isDirectory()) &&
				!settings.excludeFolders.includes(dirent.name)
			)
				return dirent.isDirectory()
					? getFileTree(res, settings)
					: {
							name: basename(res).replace(ext, ""),
							path: res,
							ext,
							date,
					  };
			else return null;
		})
	);
	return Array.prototype.concat(...files).filter((r) => r !== null);
};

/*
	::getFiles
	Get all files based on a fileTree from the input folder.
*/
export const getFiles = async (settings: ISettings): Promise<ISettings> => {
	// Get all pages and order them by Path.
	const files = (await getFileTree(settings.input, settings)).sort((a, b) =>
		a.path > b.path ? 1 : -1
	);
	return { ...settings, files };
};

/*
	::fileData
	Go through all files and there data.
*/
export const fileData = async (settings: ISettings): Promise<ISettings> => {
	await asyncForEach(settings.files, async (file: IFile, index: number) => {
		const data = await getFileData(file);
		settings.files[index].data = data;
		settings.files[index].combinedData = data;
	});
	return settings;
};

/*
	::	getFileData
	Get the file data from a given file.
*/
export const getFileData = async (file: IFile): Promise<IFile> => {
	try {
		return await readFile(file.path).then((res) => res.toString());
	} catch (err) {
		throw Error(err);
	}
};

const getLocalPath = (file: string, settings: ISettings): string =>
	file.replace(join(__dirname, "../../"), "").replace(settings.output, "");

/*
	::concatParitials
	Get all partials and add them to the parent or as a contents array.
*/
export const sectionPartials = async (
	settings: ISettings
): Promise<ISettings> => {
	const removeIndexes = [];
	await asyncForEach(settings.files, async (file: IFile, index: number) => {
		if (getLocalPath(file.path, settings).indexOf("/_") > 0) {
			const parentIndex = settings.files.findIndex(
				(parentFile: IFile) =>
					parentFile.path === join(file.path, "../../readme.md")
			);

			// If the file doesn't exist for some reason, just return.
			if (!settings.files[parentIndex]) return;
			// If the file doesnt have sections yet, add them.
			if (!settings.files[parentIndex].sections)
				settings.files[parentIndex].sections = [];

			// Add the section to an array
			settings.files[parentIndex].sections.push({
				...file.contents,
				data: file.data,
			});

			// Create a big Markdown data for search
			settings.files[parentIndex].combinedData += `\n\n${file.data}`;

			// Remove the file from the list.
			removeIndexes.push(index);
		}
	});
	// Remove them all, order the indexes from high to low to not remove the wrong pages.
	await asyncForEach(
		removeIndexes.sort((a, b) => b - a),
		(index: number) => {
			settings.files.splice(index, 1);
		}
	);

	return settings;
};

/*
	::concatParitials
	Get all partials and add them to the parent or as a contents array.
*/
export const concatPartials = async (
	settings: ISettings
): Promise<ISettings> => {
	const removeIndexes = [];
	await asyncForEach(settings.files, async (file: IFile, index: number) => {
		if (file.name.indexOf("_") === 0) {
			const parentPath = join(
				file.path.substring(0, lastIndex(file.path, file.name)),
				`readme.md`
			);

			const parentIndex = settings.files.findIndex(
				(parentFile: IFile) => parentFile.path === parentPath
			);

			// Check if the Parent has a layout defined.
			const parentData = await mdToHtml(settings.files[parentIndex]);

			// Based on the template, get the classes
			function getColumnClasses(layout: string): string {
				switch (layout) {
					case "full":
						return "small-full medium-full";
					case "half":
						return "small-full medium-half";
					case "third":
					case "thirds":
						return "small-full medium-third";
					case "quarter":
						return "small-half medium-quarter";
					default:
						return "small-full";
				}
			}
			// If the parent has a layout, the partials will be stored as contents.
			if (parentData.meta?.layout) {
				if (!settings.files[parentIndex].contents)
					settings.files[parentIndex].contents = {
						articles: [],
						name: settings.files[parentIndex].name,
						layout: parentData.meta.layout,
						classes: getColumnClasses(parentData.meta.layout),
						background: parentData.meta.background
							? parentData.meta.background
							: false,
					};
				settings.files[parentIndex].contents.articles.push({
					data: file.data,
				});
			}

			// Otherwise, the partials will be added automatically to the parent.
			else {
				// Add the data to the parent
				settings.files[parentIndex].data += `\n\n${file.data}`;
			}

			// Set the fact that this is a parent.
			settings.files[parentIndex].isParent = true;

			// Add data to a combined property for search
			settings.files[parentIndex].combinedData += `\n\n${file.data}`;

			// Remove the file from the list.
			removeIndexes.push(index);
		}
	});

	// Remove them all, order the indexes from high to low to not remove the wrong pages.
	await asyncForEach(
		removeIndexes.sort((a, b) => b - a),
		(index: number) => {
			settings.files.splice(index, 1);
		}
	);

	return settings;
};

/*
	::cleanupFilePathAfterOrder
	Cleanup the paths and names when they have characters
	to make partials or order purposes.
*/
export const cleanupFilePathAfterOrder = async (settings: ISettings) => {
	await asyncForEach(settings.files, (file: IFile, index: number) => {
		// Check prefix in filename
		// Fix the name
		if (settings.files[index].name.indexOf(":") > 0)
			settings.files[index].name = settings.files[index].name.split(":")[1];

		// Check prefix in routes
		// Fix the route
		if (settings.files[index].path.indexOf(":") > 0)
			settings.files[index].path = settings.files[index].path
				.split("/")
				.map((partial: string) => {
					if (partial.indexOf(":") > 0) {
						return partial.split(":")[1];
					} else return partial;
				})
				.join("/");
	});

	return settings;
};

/*
	:: setFileDate
	If the file doesn't have a provided date through meta. Use the creation date of the file.
*/
export const setFileDate = async (settings: ISettings): Promise<ISettings> => {
	settings.files = settings.files.map((file: IFile) => {
		return {
			...file,
			date:
				file.meta && file.meta.date
					? file.meta.date.toString().length === 8
						? convertToDate(file.meta.date)
						: new Date(file.meta.date)
					: file.date,
		};
	});
	return settings;
};
