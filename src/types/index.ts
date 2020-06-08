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
	date?: Date;
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

interface showNavigation {
	name: string;
	desktop: boolean;
	mobile: boolean;
}

export type buildTypes = "docs" | "blog";
export interface IArgumentSettings {
	input: string;
	output: string;
	layout: string;
	cleanBefore: boolean;
	theme: string;
	extensions: string[];
	excludeFolders: string[];
	copy: string[];
	strip: string[];
	flatNavigation: boolean;
	showNavigation: showNavigation[];
	codeHighlight: boolean;
	projectTitle: string;
	favicon: string;
	skip: string[];
	type: string | buildTypes;
}
export interface ISettings extends IArgumentSettings {
	files?: IFile[] | any;
	navigation?: INavigation[];
	package?: IPackageJson;
	scripts?: string;
	styles?: string;
	localConfig?: ILocalConfig;
	faviconData?: any;
	dokkie?: any;
	injectHtml?: ILocalConfigInject;
}

interface ILocalConfigOverrule {
	css: string[];
	js: string[];
}
interface ILocalConfigAdd {
	css: string[];
	js: string[];
}

export interface ILocalConfigInject {
	footerBefore?: string;
	footerAfter?: string;
	headerBefore?: string;
	headerAfter?: string;
	sidebarBefore?: string;
	sidebarAfter?: string;
	mainBefore?: string;
	mainAfter?: string;
}
interface ILocalConfig extends IArgumentSettings {
	overrule?: ILocalConfigOverrule;
	add?: ILocalConfigAdd;
	injectHtml?: ILocalConfigInject;
}

export interface IMarkdown {
	document: string;
	meta: any;
}

export interface IMenu extends showNavigation {
	menu: INavigation[];
	showClass: string;
}
export interface INavigation {
	name: string;
	link: string;
	self?: string;
	path?: string[];
	parent?: string;
	meta?: IMeta;
	children?: INavigation[];
	date?: Date;
}
export interface IFaviconResult {
	images: any;
	files: any;
}
export interface IFaviconImg {
	name: string;
	contents: string;
}
