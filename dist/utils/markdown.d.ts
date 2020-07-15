import { IMarkdown, IFileContents } from "../types";
export declare const mdToHtml: <T extends IFileContents>(file: T) => Promise<IMarkdown>;
export declare const getTitleFromMD: (str: string, clean?: boolean) => string;
