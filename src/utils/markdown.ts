// Markdown

import { IMarkdown, IFile, MarkdownItExtended } from "../types";

import meta from "markdown-it-meta";
import prism from "markdown-it-prism";
import MarkdownIt from "markdown-it";
// const MarkdownIt = require("markdown-it")({
// 	html: true,
// 	linkify: true,
// 	typographer: true,
// }).use();
const md: MarkdownItExtended = new MarkdownIt();

md.use(meta);
md.use(prism);

/*
	Convert Markdown Data to html and filter meta.
*/
export const mdToHtml = async (file: IFile): Promise<IMarkdown> => {
	const renderedDocument = md.render(file.data);
	const meta = md.meta;
	md.meta = [];
	return {
		document: renderedDocument,
		meta: meta,
	};
};

/*
	Find the first occurence of a string after a certain index.
*/

const findAfter = (str: string, needle: string, afterIndex: number): number => {
	for (let i = 0; i < str.length; i++)
		if (str[i] === needle && i > afterIndex) return i;
	return 0;
};
/*
	Get the title from a Markdown String
*/
export const getTitleFromMD = (str: string, clean = true): string => {
	const startTitle = str.indexOf("# ");
	const endTitle = findAfter(str, "\n", startTitle);

	if (clean) return str.substr(startTitle + 2, endTitle).split("\n")[0];
	return str.substr(startTitle, endTitle).split("\n")[0];
};
