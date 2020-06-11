import { parseISO } from "date-fns";
export const convertToDate = (date: number | string): Date =>
	parseISO(date.toString().replace(/\s/g, ""));
