import { INavigation } from "./navigation";
import { IArgumentSettings } from "./arguments";

interface ILocalConfigOverrule {
	css: string[];
	js: string[];
}
interface ILocalConfigAdd {
	css: string[];
	js: string[];
	excludeFolders: string[];
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

export interface ILocalConfig extends IArgumentSettings {
	overrule?: ILocalConfigOverrule;
	add?: ILocalConfigAdd;
	injectHtml?: ILocalConfigInject;
	extendNavigation?: INavigation[];
	overruleNavigation?: INavigation[];
	localConfig?: ILocalConfig;
	assets?: ILocalConfigAssets;
}

export interface ILocalConfigAssets {
	favicon?: string;
	logo?: string;
}
