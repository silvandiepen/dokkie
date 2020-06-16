import H from "handlebars";
import format from "date-fns/format";
import { asyncForEach } from "cli-block";
import { join } from "path";
const { readFile } = require("fs").promises;
import { IHandlebarsPartials, ISettings } from "../types";

const loadPartial = async (partial: string, dir: string): Promise<void> => {
	const partialTemplate = join(
		__dirname,
		"../../",
		"template",
		dir,
		`${partial}.hbs`
	);

	try {
		const file = await readFile(partialTemplate).then((r: any): string =>
			r.toString()
		);
		return file;
	} catch (err) {
		throw new Error(`${partialTemplate} doesn't exist`);
	}
};

// Create Partials
export const loadHandlebarsPartials = async (): Promise<
	IHandlebarsPartials[]
> => {
	// Create Partials
	const partialNames = [
		"headerNavigation",
		"footerNavigation",
		"sidebarNavigation",
		"overviewNavigation",
		"projectTitle",
		"blogMeta",
	];

	const partials = [];
	await asyncForEach(partialNames, async (partial: string) => {
		try {
			partials.push({
				name: partial,
				file: await loadPartial(partial, "partials").then((r) => r),
			});
		} catch (err) {
			console.log(err);
		}
	});

	return partials;
};

// Create Helpers
const helpers = {
	eq: (v1: any, v2: any): boolean => v1 === v2,
	ne: (v1: any, v2: any): boolean => v1 !== v2,
	lt: (v1: any, v2: any): boolean => v1 < v2,
	gt: (v1: any, v2: any): boolean => v1 > v2,
	lte: (v1: any, v2: any): boolean => v1 <= v2,
	gte: (v1: any, v2: any): boolean => v1 >= v2,
	includes: (v1: string[any], v2: string): boolean => v1.includes(v2),
	and(): boolean {
		return Array.prototype.every.call(arguments, Boolean);
	},
	or(): boolean {
		return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
	},
	ternary: function (cond: any, v1: any, v2: any) {
		return cond ? v1 : v2;
	},
	//  usage: {{dateFormat date format="MMMM YYYY"}}
	dateFormat: function (context: string, block: any): string {
		const f = block.hash.format || "MMM Do, YYYY";
		return format(new Date(context), f);
	},
};

Object.keys(helpers).forEach((helper) => {
	H.registerHelper(helper, helpers[helper]);
});

export const Handlebars = H;
