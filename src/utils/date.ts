import { splice } from "./helpers";
export const convertToDate = (date: number | string | any): Date => {
	let d = date;
	if (typeof d === "string") d = d.replace(/-|\s/g, "");
	else d = d.toString();

	d = splice(splice(d.toString(), 4, 0, "-"), 7, 0, "-");

	return new Date(d);
};
