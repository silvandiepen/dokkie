import H from "handlebars";
import format from "date-fns/format";
import { asyncForEach } from "./";
import { join } from "path";
const { readFile } = require("fs").promises;
import { IHandlebarsPartials, IHandlebarsBlock } from "../types";

const loadPartial = async (partial: string): Promise<void> => {
	const partialTemplate = join(
		__dirname,
		"../../",
		"template",
		`${partial}.hbs`
	);

	try {
		const fileData = await readFile(partialTemplate).then((res) =>
			res.toString()
		);

		return fileData;
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
		"partials/headerNavigation",
		"partials/footerNavigation",
		"partials/sidebarNavigation",
		"partials/overviewNavigation",
		"partials/projectTitle",
		"partials/blogMeta",
		"partials/headMeta",
		"partials/searchBlock",
		"partials/searchScript",
		"partials/loadScripts",
		"sections/columns",
		"sections/sections",
		"sections/full",
		"sections/half",
		"sections/third",
		"sections/quarter",
		"sections/intro",
	];

	const partials = [];
	await asyncForEach(partialNames, async (partial: string) => {
		try {
			partials.push({
				name:
					partial.indexOf("/") > 0
						? partial.split("/")[partial.split("/").length - 1]
						: partial,
				file: await loadPartial(partial).then((r) => r),
			});
		} catch (err) {
			throw Error(err);
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
	ternary(cond: any, v1: any, v2: any) {
		return cond ? v1 : v2;
	},
	//  usage: {{dateFormat date format="MMMM YYYY"}}
	dateFormat(context: string, block: IHandlebarsBlock): string {
		const f = block.hash.format || "MMM Do, YYYY";
		return format(new Date(context), f);
	},
	join(context: string[], block: IHandlebarsBlock) {
		return context.join(block.hash.delimiter ? block.hash.delimited : ", ");
	},
};

Object.keys(helpers).forEach((helper) => {
	H.registerHelper(helper, helpers[helper]);
});

export const Handlebars = H;
