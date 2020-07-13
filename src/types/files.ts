import { IMeta } from "./meta";

export interface IFile {
	name: string;
	title?: string;
	ext: string;
	path: string;
	destpath?: string;
	data?: string;
	html?: string;
	meta?: IMeta;
	filename?: string;
	route?: string;
	date?: Date;
	contents?: IContents;
	sections?: IContents[];
}

export interface IContents {
	articles: IFileContents[];
	layout: string;
	name: string;
	classes: string;
	background: string;
	data: string;
	html?: string;
}

export interface IFileContents {
	data: string;
	html?: string;
	meta?: string;
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

export type buildTypes = "docs" | "blog";
