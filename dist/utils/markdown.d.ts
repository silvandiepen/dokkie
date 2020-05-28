import { IMarkdown, IFile } from "../types";
export declare const mdToHtml: (file: IFile) => Promise<IMarkdown>;
export declare const getTitleFromMD: (str: string, clean?: boolean) => string;
