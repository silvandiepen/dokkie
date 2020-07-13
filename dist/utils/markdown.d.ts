import { IMarkdown, IFile, IFileContents } from "../types";
export declare const mdToHtml: (file: IFile | IFileContents) => Promise<IMarkdown>;
export declare const getTitleFromMD: (str: string, clean?: boolean) => string;
