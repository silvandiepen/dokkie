export * from "./extend";
import { IMeta } from "./extend";
export interface IFile {
    name: string;
    title?: string;
    ext: string;
    path: string;
    destpath?: string;
    data?: string;
    html?: string;
    meta?: IMeta;
    filename?: string;
    route?: string;
}
export interface IPackageJson {
    author: string;
    description: string;
    keywords: string[];
    version: string;
    name: string;
    license: string;
    [key: string]: unknown;
}
export interface IArgumentSettings {
    input?: string;
    output: string;
    layout: string;
    cleanBefore: boolean;
    theme: string;
    extensions: string[];
    excludeFolders: string[];
    copy: string[];
    strip: string[];
    flatNavigation: boolean;
    showNavigation: string[];
    codeHighlight: boolean;
    projectTitle: string;
}
export interface ISettings extends IArgumentSettings {
    files?: IFile[] | any;
    navigation?: INavigation[];
    package?: IPackageJson;
    scripts?: string;
    styles?: string;
    localConfig?: ILocalConfig;
}
interface ILocalConfigOverrule {
    stylesheets: string[];
    scripts: string[];
}
interface ILocalConfigAdd {
    stylesheets: string[];
    scripts: string[];
}
interface ILocalConfig extends IArgumentSettings {
    overrule?: ILocalConfigOverrule;
    add?: ILocalConfigAdd;
}
export interface IMarkdown {
    document: string;
    meta: any;
}
export interface INavigation {
    name: string;
    link: string;
    self?: string;
    path?: string[];
    parent?: string;
    meta?: IMeta;
    children?: INavigation[];
}
