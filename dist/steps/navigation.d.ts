import { ISettings, INavigation } from "../types";
export declare const buildNavigation: (settings: ISettings) => Promise<ISettings>;
export declare const cleanFolder: (settings: ISettings) => Promise<void>;
export declare const getNavigation: (settings: ISettings, filter: string) => INavigation[];
