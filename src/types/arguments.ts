import { showNavigation, INavigation } from "./navigation";
import {
	ILocalConfig,
	ILocalConfigAssets,
	ILocalConfigInject,
} from "./localConfig";
import { IHandlebarsPartials } from "./handleBars";
import { buildTypes, IFile, IPackageJson } from "./files";

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
	config: string;
	debug: boolean;
	enhance: string[];
	language: string;
}

export interface ISettings extends IArgumentSettings {
	files?: IFile[] | any;
	navigation?: INavigation[];
	package?: IPackageJson;
	scripts?: string;
	styles?: string;
	localConfig?: ILocalConfig;
	faviconData?: any;
	assets?: ILocalConfigAssets;
	dokkie?: any;
	injectHtml?: ILocalConfigInject;
	extendNavigation?: INavigation[];
	overruleNavigation?: INavigation[];
	partials?: IHandlebarsPartials[];
}
