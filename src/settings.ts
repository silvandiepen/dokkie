import yargs from "yargs";
import * as log from "cli-block";

import { ISettings } from "./types";

export const settings = (): ISettings => {
	const cs = yargs.options({
		type: {
			require: false,
			type: "string",
			default: "docs",
		},
		input: {
			required: false,
			type: "string",
			default: ".",
		},
		output: {
			required: false,
			type: "string",
			default: "docs",
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
	}).argv;

	return {
		type: cs.type,
		input: cs.input,
		output: cs.output,
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
	};
};
export const logSettings = (settings: ISettings): void => {
	log.BLOCK_MID("Settings");
	log.BLOCK_SETTINGS(settings);
};

export const setAlternativeDefaults = (settings: ISettings): ISettings => {
	var args = process.argv
		.slice(2)
		.map((arg) => (arg = arg.split("=")[0].replace("--", "")));

	switch (settings.type) {
		case "blog":
			if (!args.includes("layout")) settings.layout = "blog";
			if (!args.includes("output")) settings.output = "blog";
			if (!args.includes("flatNavigation")) settings.flatNavigation = true;
			if (!args.includes("showNavigation"))
				settings.showNavigation = [
					{ name: "overview", desktop: true, mobile: true },
				];
			break;
	}

	return settings;
};
