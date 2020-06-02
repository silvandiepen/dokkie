export * from "./extend";

import { IMeta } from "./extend";
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
export interface ISettings {
	input: string;
	output: string;
	layout: string;
	excludeFolders: string[];
	extensions: string[];
	cleanBefore: boolean;
	theme: string;
	copy: string[];
	strip: string[];
	files?: IFile[] | any;
	style?: string;
	navigation?: INavigation[];
	flat?: boolean;
	package?: IPackageJson;
	scripts?: string;
	styles?: string;
	showNavigation: string[];
}
export interface IMarkdown {
	document: string;
	meta: any;
}
export interface INavigation {
	name: string;
	link: string;
	self?: string;
	path?: string[];
	parent?: string;
}
