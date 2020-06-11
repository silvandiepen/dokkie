// Markdown

import { IMarkdown, IFile, MarkdownItExtended } from "../types";

import meta from "markdown-it-meta";
import prism from "markdown-it-prism";
import anchors from "markdown-it-anchor";
import { html5Media } from "markdown-it-html5-media";
import emoji from "markdown-it-emoji";
import MarkdownIt from "markdown-it";
import taskLists from "markdown-it-task-lists";
import alert from "markdown-it-alert";

const md: MarkdownItExtended = new MarkdownIt({
	html: true,
	linkify: true,
	breaks: true,
	typographer: true,
});

md.use(meta);
md.use(prism);
md.use(anchors);
md.use(html5Media);
md.use(emoji);
md.use(alert);
md.use(taskLists, { enabled: true });

/*
	Convert Markdown Data to html and filter meta.
*/
export const mdToHtml = async (file: IFile): Promise<IMarkdown> => {
	const renderedDocument = md.render(file.data);
	const meta = md.meta;
	md.meta = {};
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
	let startTitle = str.indexOf("# ");
	// console.log("index -1:  ", str.charAt(startTitle - 1));
	while (str.charAt(startTitle - 1) == "#") {
		startTitle = findAfter(str, "# ", startTitle);
		console.log("doing the while", startTitle);
	}
	// console.log(startTitle);
	let endTitle = findAfter(str, "\n", startTitle);

	if (startTitle < 0) return null;
	if (startTitle > -1 && endTitle == 0) endTitle = str.length;

	if (clean) return str.substr(startTitle + 2, endTitle).split("\n")[0];
	return str.substr(startTitle, endTitle).split("\n")[0];
};
