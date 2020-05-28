import { IFile, ISettings } from "../types";
export declare const asyncForEach: (array: any, callback: any) => Promise<void>;
export declare const writeThatFile: (file: IFile, contents: string, settings: ISettings) => Promise<void>;
export declare const getTitle: (file: IFile) => Promise<string>;
