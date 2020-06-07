import yargs from "yargs";
import * as log from "cli-block";

import { ISettings } from "./types";

export const settings = (): ISettings => {
	const cs = yargs.options({
		in: {
			required: false,
			type: "string",
			default: ".",
			alias: "input",
		},
		out: {
			required: false,
			type: "string",
			default: "docs",
			alias: "output",
		},
		layout: {
			required: false,
			type: "string",
			default: "default",
		},
		clean: {
			required: false,
			type: "string",
			default: true,
			alias: "cleanBefore",
		},
		theme: {
			required: false,
			type: "string",
			default: "coat-ext",
		},
		ext: {
			required: false,
			type: "array",
			default: [".md"],
			alias: "extensions",
		},
		exclude: {
			required: false,
			type: "array",
			default: ["node_modules", "dist", "docs"],
			alias: "excludeFolders",
		},
		copy: {
			required: false,
			type: "array",
			default: [],
		},
		strip: {
			required: false,
			type: "array",
			default: ["pages"],
		},
		flatNavigation: {
			required: false,
			type: "boolean",
			default: false,
		},
		showNavigation: {
			required: false,
			type: "array",
			default: [
				{ name: "header", mobile: true, desktop: true },
				{ name: "footer", mobile: true, desktop: true },
			],
		},
		codeHighlight: {
			required: false,
			type: "boolean",
			default: true,
		},
		projectTitle: {
			require: false,
			type: "string",
			default: "",
		},
		favicon: {
			require: false,
			type: "string",
			default: "",
		},
		skip: {
			require: false,
			type: "array",
			default: [],
		},
		type: {
			require: false,
			type: "string",
			default: "docs",
		},
	}).argv;

	return {
		input: cs.in,
		output: cs.out,
		layout: cs.layout,
		excludeFolders: cs.exclude,
		extensions: cs.ext,
		cleanBefore: cs.clean,
		theme: cs.theme,
		copy: cs.copy,
		strip: cs.strip,
		flatNavigation: cs.flatNavigation,
		showNavigation: cs.showNavigation,
		codeHighlight: cs.codeHighlight,
		projectTitle: cs.projectTitle,
		favicon: cs.favicon,
		skip: cs.skip,
		type: cs.type,
	};
};
export const logSettings = (settings: ISettings): void => {
	log.BLOCK_MID("Settings");
	log.BLOCK_SETTINGS(settings);
};
