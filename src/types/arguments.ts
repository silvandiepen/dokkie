import { ShowNavigation, INavigation } from "./navigation";
import {
	ILocalConfig,
	ILocalConfigAssets,
	ILocalConfigInject,
} from "./localConfig";
import { IHandlebarsPartials } from "./handleBars";
import { buildTypes, IFile, IPackageJson } from "./files";
import { IOutput as IFaviconData } from "iconator/src/types";

interface IAssets {
	logo?: string;
	favicon?: string;
}
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
	showNavigation: ShowNavigation[];
	codeHighlight: boolean;
	projectTitle: string;
	favicon: string;
	skip: string[];
	type: string | buildTypes;
	config: string;
	enhance: IEnhance;
	language: string;
	logging: string[];
	showHome: boolean;
	url: string;
}

export interface IEnhance {
	googleAnalytics: string | boolean;
	search: boolean;
	pageTransition: boolean;
	scrollClasses: boolean;
}
export interface ISettings extends IArgumentSettings {
	files?: IFile[] | any;
	navigation?: INavigation[];
	package?: IPackageJson;
	scripts?: string;
	styles?: string;
	localConfig?: ILocalConfig;
	faviconData?: IFaviconData;
	assets?: ILocalConfigAssets;
	version?: string;
	injectHtml?: ILocalConfigInject;
	extendNavigation?: INavigation[];
	overruleNavigation?: INavigation[];
	partials?: IHandlebarsPartials[];
	layoutFile?: string;
}
