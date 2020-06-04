import { ISettings } from "../types";
export declare const getPackageInformation: (settings: ISettings) => Promise<ISettings>;
export declare const loadLocalConfig: (settings: ISettings) => Promise<ISettings>;
export declare const setLocalConfig: (settings: ISettings) => ISettings;
