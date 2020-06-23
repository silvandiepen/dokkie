import { IMeta } from "./meta";

export interface showNavigation {
	name: string;
	desktop: boolean;
	mobile: boolean;
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
