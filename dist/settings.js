"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAlternativeDefaults = exports.getDokkiePackage = exports.settings = exports.defaultSettings = void 0;
const yargs_1 = __importDefault(require("yargs"));
const { readFile } = require("fs").promises;
const path_1 = require("path");
const steps_1 = require("./steps");
exports.defaultSettings = {
    type: "docs",
    input: ".",
    output: "dokkie",
    layout: "default",
    cleanBefore: true,
    theme: "feather-ext",
    extensions: [".md"],
    excludeFolders: ["node_modules", "dist", "public"],
    copy: [],
    strip: ["pages"],
    codeHighlight: true,
    projectTitle: "",
    favicon: "",
    flatNavigation: false,
    skip: [],
    showNavigation: [
        { name: "header", mobile: true, desktop: true },
        { name: "footer", mobile: true, desktop: true },
    ],
    config: "dokkie.config.json",
    enhance: ["page-transition"],
    language: "en",
    search: true,
    logging: [],
    showHome: false,
};
exports.settings = () => {
    const cs = yargs_1.default.options({
        type: {
            require: false,
            type: "string",
            default: exports.defaultSettings.type,
        },
        input: {
            required: false,
            type: "string",
            default: exports.defaultSettings.input,
            alias: "i",
        },
        output: {
            required: false,
            type: "string",
            default: exports.defaultSettings.output,
            alias: "o",
        },
        layout: {
            required: false,
            type: "string",
            default: exports.defaultSettings.layout,
            alias: "l",
        },
        cleanBefore: {
            required: false,
            type: "string",
            default: exports.defaultSettings.cleanBefore,
            alias: "c",
        },
        theme: {
            required: false,
            type: "string",
            default: exports.defaultSettings.theme,
            alias: "t",
        },
        extensions: {
            required: false,
            type: "array",
            default: exports.defaultSettings.extensions,
            alias: "ext",
        },
        excludeFolders: {
            required: false,
            type: "array",
            default: exports.defaultSettings.excludeFolders,
            alias: "exclude",
        },
        copy: {
            required: false,
            type: "array",
            default: exports.defaultSettings.copy,
            alias: "c",
        },
        strip: {
            required: false,
            type: "array",
            default: exports.defaultSettings.strip,
        },
        flatNavigation: {
            required: false,
            type: "boolean",
            default: exports.defaultSettings.flatNavigation,
        },
        showNavigation: {
            required: false,
            type: "array",
            default: exports.defaultSettings.showNavigation,
        },
        codeHighlight: {
            required: false,
            type: "boolean",
            default: exports.defaultSettings.codeHighlight,
        },
        projectTitle: {
            require: false,
            type: "string",
            default: exports.defaultSettings.projectTitle,
        },
        favicon: {
            require: false,
            type: "string",
            default: exports.defaultSettings.favicon,
        },
        skip: {
            require: false,
            type: "array",
            default: exports.defaultSettings.skip,
        },
        config: {
            require: false,
            type: "string",
            default: exports.defaultSettings.config,
        },
        enhance: {
            require: false,
            type: "array",
            default: exports.defaultSettings.enhance,
        },
        language: {
            require: false,
            type: "string",
            default: exports.defaultSettings.language,
        },
        search: {
            require: false,
            type: "boolean",
            default: exports.defaultSettings.search,
        },
        logging: {
            require: false,
            type: "array",
            default: exports.defaultSettings.logging,
        },
        showHome: {
            require: false,
            type: "boolean",
            default: exports.defaultSettings.showHome,
        },
    }).argv;
    return {
        type: cs.type,
        input: cs.input,
        output: cs.output,
        layout: cs.layout,
        excludeFolders: cs.excludeFolders,
        extensions: cs.extensions,
        cleanBefore: cs.cleanBefore,
        theme: cs.theme,
        copy: cs.copy,
        strip: cs.strip,
        flatNavigation: cs.flatNavigation,
        showNavigation: cs.showNavigation,
        codeHighlight: cs.codeHighlight,
        projectTitle: cs.projectTitle,
        favicon: cs.favicon,
        skip: cs.skip,
        config: cs.config,
        enhance: cs.enhance,
        language: cs.language,
        search: cs.search,
        logging: cs.logging,
        showHome: cs.showHome,
    };
};
exports.getDokkiePackage = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dokkiePackage = yield readFile(path_1.join(__dirname, "../package.json"));
        return Object.assign(Object.assign({}, settings), { dokkie: JSON.parse(dokkiePackage) });
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.setAlternativeDefaults = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    var args = process.argv
        .slice(2)
        .map((arg) => (arg = arg.split("=")[0].replace("--", "")));
    switch (settings.type) {
        case "blog":
            if (!args.includes("layout"))
                settings.layout = "blog";
            if (!args.includes("theme"))
                settings.theme = "feather-blog";
            if (!args.includes("flatNavigation"))
                settings.flatNavigation = true;
            if (!args.includes("showNavigation"))
                settings.showNavigation = [
                    { name: "overview", desktop: true, mobile: true },
                ];
            break;
        case "docs":
            if (!args.includes("input")) {
                const files = yield steps_1.getFileTree(settings.input, settings);
                if (files.length == 1) {
                    settings.layout = "simple";
                }
            }
            break;
        case "website":
            if (!args.includes("layout"))
                settings.layout = "website";
            if (!args.includes("theme"))
                settings.theme = "feather-web";
            break;
    }
    return settings;
});
//# sourceMappingURL=settings.js.map