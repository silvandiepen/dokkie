const { readdir, readFile, stat } = require("fs").promises;
import { basename, extname, resolve } from "path";
import { ISettings, IFile } from "../types";
import { asyncForEach, convertToDate } from "../utils";

export const getFileTree = async (
	dir: string,
	settings: ISettings
): Promise<IFile[]> => {
	const dirents = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		dirents.map(async (dirent: any) => {
			// console.log(dirent);
			const res = resolve(dir, dirent.name);
			const ext = extname(res);
			const date = await stat(res);

			// console.log(settings.excludeFolders);

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
							ext: ext,
							date: new Date(date.birthtime),
					  };
			else return null;
		})
	);
	return Array.prototype.concat(...files).filter((r) => r !== null);
};

export const getFiles = async (settings: ISettings): Promise<ISettings> => {
	// Get all pages and order them by Path.
	const files = await (
		await getFileTree(settings.input, settings)
	).sort((a, b) => (a.path > b.path ? 1 : -1));
	return { ...settings, files: files };
};

export const fileData = async (settings: ISettings): Promise<ISettings> => {
	await asyncForEach(settings.files, async (file: IFile, index: number) => {
		settings.files[index].data = await getFileData(file);
	});
	return settings;
};

export const concatPartials = async (
	settings: ISettings
): Promise<ISettings> => {
	// console.log(settings.files);
	const removeIndexes = [];
	await asyncForEach(settings.files, (file: IFile, index: number) => {
		if (file.name.indexOf("_") == 0) {
			const parentIndex = settings.files.findIndex(
				(parentFile: IFile) =>
					parentFile.path == file.path.replace(file.name, "readme")
			);
			// Add the data to the parent
			settings.files[parentIndex].data =
				settings.files[parentIndex].data + file.data;
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

export const getFileData = async (file: IFile): Promise<IFile> => {
	try {
		let fileData = await readFile(file.path).then((res) => res.toString());
		return fileData;
	} catch (err) {
		console.log(err);
	}
};
export const setFileDate = async (settings: ISettings): Promise<ISettings> => {
	settings.files = settings.files.map((file: IFile) => {
		return {
			...file,
			date:
				file.meta && file.meta.date
					? file.meta.date.toString().length == 8
						? convertToDate(file.meta.date)
						: new Date(file.meta.date)
					: file.date,
		};
	});
	return settings;
};
