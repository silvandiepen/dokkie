const { writeFile, mkdir } = require("fs").promises;
import { join, dirname } from "path";
import { getTitleFromMD } from "./markdown";
import { IFile, ISettings } from "../types";

export const asyncForEach = async (array: any, callback: any) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
};

const makeRoute = (file: IFile, settings: ISettings): string => {
	const pre = join(__dirname, "../../").replace(/\/$/, "");
	const post = dirname(file.path).replace(pre, "");
	const route = join(pre, settings.output, post);
	return route;
};
const makeFileName = (file: IFile): string => {
	const filename =
		file.name == "README" || file.name == "Readme" || file.name == "readme"
			? "index"
			: file.name.toLowerCase() + "/index";
	return filename + ".html";
};

const createFolder = async (folder): Promise<void> => {
	await mkdir(folder, { recursive: true }, () => {
		return;
	});
};
export const writeThatFile = async (
	file: IFile,
	contents: string,
	settings: ISettings
): Promise<void> => {
	try {
		const filePath = join(makeRoute(file, settings), makeFileName(file));
		await createFolder(dirname(filePath));
		await writeFile(filePath, contents);
	} catch (err) {
		console.log(err);
	}
};

export const getTitle = async (file: IFile): Promise<string> => {
	if (file.meta && file.meta.title) return file.meta.title;
	else if (file.ext == ".md" && getTitleFromMD(file.data))
		return getTitleFromMD(file.data);
	else {
		return file.name;
	}
};
