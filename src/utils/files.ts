const { writeFile, mkdir } = require("fs").promises;
const { createWriteStream } = require("fs");
import { join, dirname } from "path";
import { getTitleFromMD } from "./markdown";
import { IFile, ISettings } from "../types";
import * as log from "cli-block";
import fetch from "node-fetch";
import { blue } from "kleur";

export const asyncForEach = async (array: any, callback: any) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
};

export const makeRoute = (file: IFile, settings: ISettings): string => {
	const pre = join(process.cwd()).replace(/\/$/, "");
	const post = dirname(file.path).replace(pre, "");
	let route = join(post, makeFileName(file));

	if (settings.input !== ".") {
		settings.strip.push(settings.input);
	}
	if (settings.strip)
		settings.strip.forEach((ignoredPath) => {
			route = route.replace("/" + ignoredPath, "");
		});

	route = route.charAt(0) === "/" ? route : "/" + route;

	return route;
};
export const makePath = (file: IFile, settings: ISettings): string => {
	const pre = join(process.cwd()).replace(/\/$/, "");
	const post = dirname(file.path).replace(pre, "");
	let route = join(pre, settings.output, post);
	if (settings.strip)
		settings.strip.forEach((ignoredPath) => {
			route = route.replace("/" + ignoredPath, "");
		});
	return route;
};
export const makeFileName = (file: IFile): string => {
	const filename =
		file.name == "README" || file.name == "Readme" || file.name == "readme"
			? "index"
			: file.name.toLowerCase() + "/index";
	return filename + ".html";
};

export const createFolder = async (folder): Promise<void> => {
	await mkdir(folder, { recursive: true }, () => {
		return;
	});
};
export const writeThatFile = async (
	file: IFile,
	contents: string,
	simple: boolean = false
): Promise<void> => {
	try {
		const filePath = join(file.destpath, file.filename);
		await createFolder(dirname(filePath));
		await writeFile(filePath, contents);
		log.BLOCK_LINE_SUCCESS(file.title);
		if (!simple) {
			// log.BLOCK_LINE(`${file.name}${file.ext}`);
			log.BLOCK_LINE(`→ ${blue(file.route)}`);
			log.BLOCK_LINE();
		}
	} catch (err) {
		console.log(err);
	}
};

export const getPageTitle = (file: IFile): string => {
	if (file.meta && file.meta.title) {
		return file.meta.title;
	} else if (file.ext === ".md" && getTitleFromMD(file.data)) {
		return getTitleFromMD(file.data);
	} else {
		return file.name;
	}
};

export const download = async (url, destination) => {
	const res: any = await fetch(url);
	createFolder(dirname(url));
	await new Promise((resolve, reject) => {
		const fileStream = createWriteStream(destination);
		res.body?.pipe(fileStream);
		res.body?.on("error", (err) => {
			reject(err);
		});
		fileStream.on("finish", function () {
			resolve();
		});
	});
};
