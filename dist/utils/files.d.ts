import { IFile, ISettings, INavigation } from "../types";
export declare const asyncForEach: (array: any, callback: any) => Promise<void>;
export declare const makeRoute: (file: IFile, settings: ISettings) => string;
export declare const makePath: (file: IFile, settings: ISettings) => string;
export declare const makeFileName: (file: IFile) => string;
export declare const writeThatFile: (file: IFile, contents: string, settings: ISettings) => Promise<void>;
export declare const getTitle: (file: IFile) => Promise<string>;
export declare const buildNavigation: (settings: ISettings) => INavigation[];
