export * from "./extend";

import { IMeta } from "./extend";
export interface IFile {
	name: string;
	ext: string;
	path: string;
	data?: string;
	html?: string;
	meta?: IMeta;
}
export interface ISettings {
	input: string;
	output: string;
	files?: IFile[] | any;
	layout: string;
	excludeFolders: string[];
	extensions: string[];
	cleanBefore: boolean;
	theme: string;
	style?: string;
}
export interface IMarkdown {
	document: string;
	meta: any;
}
