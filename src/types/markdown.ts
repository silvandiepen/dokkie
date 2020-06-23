import MarkdownIt from "markdown-it";
import { IMeta } from "./meta";
export interface MarkdownItExtended extends MarkdownIt, IMeta {
	meta?: IMeta;
	document?: string;
}
