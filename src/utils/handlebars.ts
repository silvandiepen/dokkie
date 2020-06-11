import H from "handlebars";
import format from "date-fns/format";
import { asyncForEach } from "cli-block";
const { readFile } = require("fs").promises;

export const helpers = {
	eq: (v1: any, v2: any): any => v1 === v2,
	ne: (v1: any, v2: any): any => v1 !== v2,
	lt: (v1: any, v2: any): any => v1 < v2,
	gt: (v1: any, v2: any): any => v1 > v2,
	lte: (v1: any, v2: any): any => v1 <= v2,
	gte: (v1: any, v2: any): any => v1 >= v2,
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

const partials = [
	"headerNavigation",
	"footerNavigation",
	"sidebarNavigation",
	"overviewNavigation",
];

asyncForEach(partials, async (partial: string) => {
	const file = await readFile(
		`template/partials/${partial}.hbs`
	).then((r: any): string => r.toString());

	H.registerPartial(partial, file);
});

Object.keys(helpers).forEach((helper) => {
	H.registerHelper(helper, helpers[helper]);
});

export const Handlebars = H;
