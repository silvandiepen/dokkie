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
exports.setAlternativeDefaults = exports.getDokkiePackage = exports.settings = void 0;
const yargs_1 = __importDefault(require("yargs"));
const { readFile } = require("fs").promises;
const path_1 = require("path");
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
exports.getDokkiePackage = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    const dokkiePackage = yield readFile(path_1.join(__dirname, "../package.json"));
    return Object.assign(Object.assign({}, settings), { dokkie: JSON.parse(dokkiePackage) });
});
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