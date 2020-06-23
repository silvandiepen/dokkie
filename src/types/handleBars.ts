import { INavigation } from "./navigation";
import { IPackageJson } from "./files";
import { IMeta } from "./meta";

interface IHandlebarsBlockData {
	root: IHandlebarsBlockDataRoot;
}
interface IHandlebarsBlockDataRoot {
	logo: string;
	package: IPackageJson;
	favicon: any;
	enhance: string[];
	skip: string[];
	injectHtml: any;
	styles: string;
	scripts: string;
	projectTitle: string;
	title: string;
	content: string;
	currentLink: string;
	currentId: string;
	headerNavigation: INavigation[];
	footerNavigation: INavigation[];
	sidebarNavigation: INavigation[];
	overviewNavigation: INavigation[];
	meta: IMeta;
	hasMeta: boolean;
}

interface IHandlebarsBlockLocLine {
	line: number;
	column: number;
}
interface IHandlebarsBlockLoc {
	start: IHandlebarsBlockLocLine;
	end: IHandlebarsBlockLocLine;
}

export interface IHandlebarsBlock {
	lookupProperty: any;
	name: string;
	hash: any;
	data: IHandlebarsBlockData;
	loc: IHandlebarsBlockLoc;
}
export interface IHandlebarsPartials {
	name: string;
	file: string;
}
