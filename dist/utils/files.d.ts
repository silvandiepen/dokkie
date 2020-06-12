import { IFile, ISettings } from "../types";
export declare const asyncForEach: (array: any, callback: any) => Promise<void>;
export declare const makeRoute: (file: IFile, settings: ISettings) => string;
export declare const makePath: (file: IFile, settings: ISettings) => string;
export declare const makeFileName: (file: IFile) => string;
export declare const createFolder: (folder: any) => Promise<void>;
export declare const writeThatFile: (file: IFile, contents: string, simple?: boolean) => Promise<void>;
export declare const getPageTitle: (file: IFile) => string;
export declare const download: (url: any, destination: any) => Promise<void>;
