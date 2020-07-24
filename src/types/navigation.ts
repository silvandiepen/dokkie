import { IMeta } from "./meta";

export interface ShowNavigation {
	name: string;
	desktop: boolean;
	mobile: boolean;
}

export interface IMenu extends ShowNavigation {
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

export interface INavItem {
	name: string;
	link: string;
}
