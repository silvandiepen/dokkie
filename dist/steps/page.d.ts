import { ISettings } from "../types";
export declare const convertDataToHtml: (settings: ISettings) => Promise<ISettings>;
export declare const filterHiddenPages: (settings: ISettings) => Promise<ISettings>;
export declare const getLayout: (settings: ISettings) => Promise<ISettings>;
export declare const reformInjectHtml: (settings: ISettings) => Promise<ISettings>;
export declare const createPages: (settings: ISettings) => Promise<void>;
export declare const copyFolders: (settings: ISettings) => Promise<void>;
export declare const createPageData: (settings: ISettings) => void;
export declare const setHomePage: (settings: ISettings) => ISettings;
