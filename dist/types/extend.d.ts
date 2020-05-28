import MarkdownIt from "markdown-it";
export interface IMeta {
    [x: string]: string | string[] | any;
}
export interface MarkdownItExtended extends MarkdownIt, IMeta {
    meta?: IMeta;
    document?: string;
}
