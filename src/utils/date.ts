import { parseISO } from "date-fns";
export const convertToDate = (date: number): Date => parseISO(date.toString());
