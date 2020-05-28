import yargs from "yargs";

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
			default: "coat",
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
	}).argv;

	return {
		input: cs.in,
		output: cs.out,
		layout: cs.layout,
		excludeFolders: cs.exclude,
		extensions: cs.ext,
		cleanBefore: cs.clean,
		theme: cs.theme,
	};
};
