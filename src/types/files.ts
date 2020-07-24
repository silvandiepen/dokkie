import { IMeta } from "./meta";

export interface IFile extends IFileContents {
	name: string;
	title?: string;
	ext: string;
	path: string;
	destpath?: string;
	combinedData?: string;
	filename?: string;
	route?: string;
	date?: Date;
	contents?: IContents;
	sections?: IContents[];
	isParent?: boolean;
}

export interface IContents extends IFileContents {
	articles: IFileContents[];
	layout: string;
	name: string;
	classes: string;
	background?: string;
}

export interface IFileContents extends IToMarkdown {
	data: string;
}
export interface IToMarkdown {
	meta: IMeta;
	html: string;
}

export interface IPackageJson {
	author: string;
	description: string;
	keywords: string[];
	version: string;
	name: string;
	license: string;
	[key: string]: unknown;
}

export type buildTypes = "docs" | "blog" | "website";
