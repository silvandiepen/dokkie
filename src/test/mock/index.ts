import { ISettings } from "../../types";

export const baseSettings: ISettings = {
	type: "docs",
	input: ".",
	output: "docs",
	layout: "default",
	cleanBefore: true,
	theme: "coat-ext",
	extensions: [".md"],
	excludeFolders: ["node_modules", "dist", "docs"],
	copy: [],
	strip: ["pages"],
	flatNavigation: false,
	showNavigation: [
		{ name: "header", mobile: true, desktop: true },
		{ name: "footer", mobile: true, desktop: true },
	],
	codeHighlight: true,
	projectTitle: "",
	favicon: "",
	skip: [],
	config: "dokkie.config.json",
};
