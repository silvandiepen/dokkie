const { readdir, readFile } = require("fs").promises;
import { basename, extname, resolve } from "path";
import { ISettings, IFile } from "../types";
import { asyncForEach } from "../utils";

export const getFileTree = async (
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

export const getFiles = async (settings: ISettings): Promise<ISettings> => {
	const files = await getFileTree(settings.input, settings);
	return { ...settings, files: files };
};

export const fileData = async (settings: ISettings): Promise<ISettings> => {
	await asyncForEach(settings.files, async (file) => {
		file.data = await getFileData(file);
	});
	return { ...settings };
};

export const getFileData = async (file: IFile): Promise<IFile> => {
	try {
		let fileData = await readFile(file.path).then((res) => res.toString());
		return fileData;
	} catch (err) {
		console.log(err);
	}
};
