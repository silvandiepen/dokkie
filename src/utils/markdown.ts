// Markdown

import { IMarkdown, IFileContents, MarkdownItExtended } from "../types";

import prism from "markdown-it-prism";
import anchors from "markdown-it-anchor";
import { html5Media } from "markdown-it-html5-media";
import emoji from "markdown-it-emoji";
import MarkdownIt from "markdown-it";
import taskLists from "markdown-it-task-lists";
import definitionList from "markdown-it-deflist";
import alert from "markdown-it-alert";
import abbr from "markdown-it-abbr";
import footnote from "markdown-it-footnote";
import multiLineTable from "markdown-it-multimd-table";
import { extractMeta, removeMeta } from "./markdown-meta";

const md: MarkdownItExtended = new MarkdownIt({
	html: true,
	linkify: true,
	breaks: true,
	typographer: true,
});

md.use(prism);
md.use(anchors);
md.use(html5Media);
md.use(emoji);
md.use(alert);
md.use(definitionList);
md.use(footnote);
md.use(multiLineTable);
md.use(abbr);
md.use(taskLists, { enabled: true, label: true, labelAfter: true });
/*
	Convert Markdown Data to html and filter meta.
*/
export const mdToHtml = async <T extends IFileContents>(
	file: T
): Promise<IMarkdown> => {
	const strippedData = await removeMeta(file.data);
	const renderedDocument = md.render(strippedData);
	const metaData = await extractMeta(file.data);

	return {
		document: renderedDocument,
		meta: metaData,
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
	while (str.charAt(startTitle - 1) === "#") {
		startTitle = findAfter(str, "# ", startTitle);
	}
	let endTitle = findAfter(str, "\n", startTitle);

	if (startTitle < 0) return null;
	if (startTitle > -1 && endTitle === 0) endTitle = str.length;

	if (clean) return str.substr(startTitle + 2, endTitle).split("\n")[0];
	return str.substr(startTitle, endTitle).split("\n")[0];
};
