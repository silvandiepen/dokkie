import { ISettings } from "./types";
export declare const settings: () => ISettings;
export declare const logSettings: (settings: ISettings) => void;
export declare const setAlternativeDefaults: (settings: ISettings) => ISettings;
