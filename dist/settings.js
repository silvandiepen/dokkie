"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAlternativeDefaults = exports.logSettings = exports.settings = void 0;
const yargs_1 = __importDefault(require("yargs"));
const log = __importStar(require("cli-block"));
exports.settings = () => {
    const cs = yargs_1.default.options({
        type: {
            require: false,
            type: "string",
            default: "docs",
        },
        input: {
            required: false,
            type: "string",
            default: ".",
        },
        output: {
            required: false,
            type: "string",
            default: "docs",
        },
        layout: {
            required: false,
            type: "string",
            default: "default",
        },
        clean: {
            required: false,
            type: "string",
            default: true,
            alias: "cleanBefore",
        },
        theme: {
            required: false,
            type: "string",
            default: "coat-ext",
        },
        ext: {
            required: false,
            type: "array",
            default: [".md"],
            alias: "extensions",
        },
        exclude: {
            required: false,
            type: "array",
            default: ["node_modules", "dist", "docs"],
            alias: "excludeFolders",
        },
        copy: {
            required: false,
            type: "array",
            default: [],
        },
        strip: {
            required: false,
            type: "array",
            default: ["pages"],
        },
        flatNavigation: {
            required: false,
            type: "boolean",
            default: false,
        },
        showNavigation: {
            required: false,
            type: "array",
            default: [
                { name: "header", mobile: true, desktop: true },
                { name: "footer", mobile: true, desktop: true },
            ],
        },
        codeHighlight: {
            required: false,
            type: "boolean",
            default: true,
        },
        projectTitle: {
            require: false,
            type: "string",
            default: "",
        },
        favicon: {
            require: false,
            type: "string",
            default: "",
        },
        skip: {
            require: false,
            type: "array",
            default: [],
        },
    }).argv;
    return {
        type: cs.type,
        input: cs.input,
        output: cs.output,
        layout: cs.layout,
        excludeFolders: cs.exclude,
        extensions: cs.ext,
        cleanBefore: cs.clean,
        theme: cs.theme,
        copy: cs.copy,
        strip: cs.strip,
        flatNavigation: cs.flatNavigation,
        showNavigation: cs.showNavigation,
        codeHighlight: cs.codeHighlight,
        projectTitle: cs.projectTitle,
        favicon: cs.favicon,
        skip: cs.skip,
    };
};
exports.logSettings = (settings) => {
    log.BLOCK_MID("Settings");
    log.BLOCK_SETTINGS(settings);
};
exports.setAlternativeDefaults = (settings) => {
    var args = process.argv
        .slice(2)
        .map((arg) => (arg = arg.split("=")[0].replace("--", "")));
    switch (settings.type) {
        case "blog":
            if (!args.includes("layout"))
                settings.layout = "blog";
            if (!args.includes("output"))
                settings.output = "blog";
            if (!args.includes("flatNavigation"))
                settings.flatNavigation = true;
            if (!args.includes("showNavigation"))
                settings.showNavigation = [
                    { name: "overview", desktop: true, mobile: true },
                ];
            break;
    }
    return settings;
};
//# sourceMappingURL=settings.js.map