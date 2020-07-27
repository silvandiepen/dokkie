import yargs from "yargs";
const { readFile } = require("fs").promises;
import { join } from "path";

import { getFileTree } from "./steps";

import { ISettings } from "./types";

export const defaultSettings = {
	type: "docs",
	input: ".",
	output: "dokkie",
	layout: "default",
	assets: {},
	cleanBefore: true,
	theme: "feather-ext",
	extensions: [".md"],
	excludeFolders: ["node_modules", "dist", "public"],
	copy: [],
	strip: ["pages"],
	codeHighlight: true,
	projectTitle: "",
	favicon: "",
	flatNavigation: false,
	skip: [],
	showNavigation: [
		{ name: "header", mobile: true, desktop: true },
		{ name: "footer", mobile: true, desktop: true },
	],
	config: "dokkie.config.json",
	enhance: ["page-transition"],
	language: "en",
	search: true,
	logging: [],
	showHome: false,
	url: "",
};

export const settings = (): ISettings => {
	const cs = yargs.options({
		type: {
			require: false,
			type: "string",
			default: defaultSettings.type,
		},
		input: {
			required: false,
			type: "string",
			default: defaultSettings.input,
			alias: "i",
		},
		output: {
			required: false,
			type: "string",
			default: defaultSettings.output,
			alias: "o",
		},
		layout: {
			required: false,
			type: "string",
			default: defaultSettings.layout,
			alias: "l",
		},
		cleanBefore: {
			required: false,
			type: "string",
			default: defaultSettings.cleanBefore,
			alias: "c",
		},
		theme: {
			required: false,
			type: "string",
			default: defaultSettings.theme,
			alias: "t",
		},
		extensions: {
			required: false,
			type: "array",
			default: defaultSettings.extensions,
			alias: "ext",
		},
		excludeFolders: {
			required: false,
			type: "array",
			default: defaultSettings.excludeFolders,
			alias: "exclude",
		},
		copy: {
			required: false,
			type: "array",
			default: defaultSettings.copy,
			alias: "c",
		},
		strip: {
			required: false,
			type: "array",
			default: defaultSettings.strip,
		},
		flatNavigation: {
			required: false,
			type: "boolean",
			default: defaultSettings.flatNavigation,
		},
		showNavigation: {
			required: false,
			type: "array",
			default: defaultSettings.showNavigation,
		},
		codeHighlight: {
			required: false,
			type: "boolean",
			default: defaultSettings.codeHighlight,
		},
		projectTitle: {
			require: false,
			type: "string",
			default: defaultSettings.projectTitle,
		},
		favicon: {
			require: false,
			type: "string",
			default: defaultSettings.favicon,
		},
		logo: {
			required: false,
			type: "string",
			default: null,
		},

		skip: {
			require: false,
			type: "array",
			default: defaultSettings.skip,
		},
		config: {
			require: false,
			type: "string",
			default: defaultSettings.config,
		},
		enhance: {
			require: false,
			type: "array",
			default: defaultSettings.enhance,
		},
		language: {
			require: false,
			type: "string",
			default: defaultSettings.language,
		},
		search: {
			require: false,
			type: "boolean",
			default: defaultSettings.search,
		},
		logging: {
			require: false,
			type: "array",
			default: defaultSettings.logging,
		},
		showHome: {
			require: false,
			type: "boolean",
			default: defaultSettings.showHome,
		},
		url: {
			require: false,
			type: "string",
			default: defaultSettings.url,
		},
	}).argv;

	return {
		type: cs.type,
		input: cs.input,
		output: cs.output,
		layout: cs.layout,
		excludeFolders: cs.excludeFolders,
		extensions: cs.extensions,
		cleanBefore: cs.cleanBefore,
		theme: cs.theme,
		assets: { logo: cs.logo, favicon: cs.favicon },
		copy: cs.copy,
		strip: cs.strip,
		flatNavigation: cs.flatNavigation,
		showNavigation: cs.showNavigation,
		codeHighlight: cs.codeHighlight,
		projectTitle: cs.projectTitle,
		favicon: cs.favicon,
		skip: cs.skip,
		config: cs.config,
		enhance: cs.enhance,
		language: cs.language,
		search: cs.search,
		logging: cs.logging,
		showHome: cs.showHome,
		url: cs.url,
	};
};

export const getDokkiePackage = async (s: ISettings): Promise<ISettings> => {
	try {
		const dokkiePackage = await readFile(join(__dirname, "../package.json"));
		return { ...s, dokkie: JSON.parse(dokkiePackage) };
	} catch (err) {
		throw new Error(err);
	}
};

export const setAlternativeDefaults = async (
	s: ISettings
): Promise<ISettings> => {
	const args = process.argv
		.slice(2)
		.map((arg) => (arg = arg.split("=")[0].replace("--", "")));

	switch (s.type) {
		case "blog":
			if (!args.includes("layout")) s.layout = "blog";
			if (!args.includes("theme")) s.theme = "feather-blog";
			if (!args.includes("flatNavigation")) s.flatNavigation = true;
			if (!args.includes("showNavigation"))
				if (!args.includes("showNavigation")) {
					s.showNavigation = [
						{ name: "overview", desktop: true, mobile: true },
					];
				}
			break;
		case "docs":
			if (!args.includes("input")) {
				const files = await getFileTree(s.input, s);
				if (files.length === 1) s.layout = "simple";
			}
			break;
		case "website":
			if (!args.includes("layout")) s.layout = "website";
			if (!args.includes("theme")) s.theme = "feather-web";
			break;
	}

	return s;
};
