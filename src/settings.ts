import yargs from "yargs";
import * as log from "cli-block";
const { readFile } = require("fs").promises;
import { join } from "path";

import { getFileTree } from "./steps";

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
			alias: "i",
		},
		output: {
			required: false,
			type: "string",
			default: "dokkie",
			alias: "o",
		},
		layout: {
			required: false,
			type: "string",
			default: "default",
			alias: "l",
		},
		clean: {
			required: false,
			type: "string",
			default: true,
			alias: "c",
		},
		theme: {
			required: false,
			type: "string",
			default: "coat-ext",
			alias: "t",
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
			alias: "c",
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
		config: {
			require: false,
			type: "string",
			default: "dokkie.config.json",
		},
		debug: {
			require: false,
			type: "boolean",
			default: false,
		},
		enhance: {
			require: false,
			type: "array",
			default: ["page-transition"],
		},
	}).argv;

	if (cs.help) {
		console.log("help page");
		return;
	}

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
		config: cs.config,
		debug: cs.debug,
		enhance: cs.enhance,
	};
};

export const getDokkiePackage = async (
	settings: ISettings
): Promise<ISettings> => {
	const dokkiePackage = await readFile(join(__dirname, "../package.json"));
	return { ...settings, dokkie: JSON.parse(dokkiePackage) };
};

export const setAlternativeDefaults = async (
	settings: ISettings
): Promise<ISettings> => {
	var args = process.argv
		.slice(2)
		.map((arg) => (arg = arg.split("=")[0].replace("--", "")));

	switch (settings.type) {
		case "blog":
			if (!args.includes("layout")) settings.layout = "blog";
			if (!args.includes("flatNavigation")) settings.flatNavigation = true;
			if (!args.includes("showNavigation"))
				settings.showNavigation = [
					{ name: "overview", desktop: true, mobile: true },
				];
			break;
		case "docs":
			if (!args.includes("input")) {
				const files = await getFileTree(settings.input, settings);
				if (files.length == 1) {
					settings.layout = "simple";
				}
			}
	}

	return settings;
};
