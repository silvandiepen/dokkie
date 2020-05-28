import yargs from "yargs";

import { ISettings } from "./types";

export const settings = (): ISettings => {
	const cs = yargs.options({
		in: {
			required: true,
			type: "string",
			default: ".",
			alias: "input",
		},
		out: {
			required: true,
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
	}).argv;

	return {
		input: cs.in,
		output: cs.out,
		layout: cs.layout,
		excludeFolders: ["node_modules", "dist", "docs"],
		extensions: [".md"],
		cleanBefore: cs.clean,
		theme: cs.theme,
	};
};
