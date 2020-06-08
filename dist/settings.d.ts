import { ISettings } from "./types";
export declare const settings: () => ISettings;
export declare const getDokkiePackage: (settings: ISettings) => Promise<ISettings>;
export declare const setAlternativeDefaults: (settings: ISettings) => Promise<ISettings>;
