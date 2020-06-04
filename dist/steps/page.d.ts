import { ISettings } from "../types";
export declare const convertDataToHtml: (settings: ISettings) => Promise<ISettings>;
export declare const filterHiddenPages: (settings: ISettings) => Promise<ISettings>;
export declare const getLayout: (settings: ISettings) => Promise<ISettings>;
export declare const createFiles: (settings: ISettings) => Promise<void>;
export declare const copyFolders: (settings: ISettings) => Promise<void>;
