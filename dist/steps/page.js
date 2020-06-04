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
exports.copyFolders = exports.createFiles = exports.getLayout = exports.filterHiddenPages = exports.convertDataToHtml = void 0;
const utils_1 = require("../utils");
const log = __importStar(require("cli-block"));
const prettier_1 = __importDefault(require("prettier"));
const ncp = require("ncp").ncp;
const _1 = require("./");
const { readFile } = require("fs").promises;
const path_1 = require("path");
// Convert filedata to html.
exports.convertDataToHtml = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    yield utils_1.asyncForEach(settings.files, (file) => __awaiter(void 0, void 0, void 0, function* () {
        switch (file.ext) {
            case ".md":
                const markdownData = yield utils_1.mdToHtml(file);
                file.meta = markdownData.meta;
                file.html = markdownData.document;
                break;
            case ".html":
                file.meta = {};
                file.html = file.data;
                break;
        }
    }));
    return Object.assign(Object.assign({}, settings), { files: settings.files });
});
// Filter files
exports.filterHiddenPages = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    const files = settings.files.filter((file) => file.meta.remove ? null : file);
    return Object.assign(Object.assign({}, settings), { files: files });
});
// Get the layouts
exports.getLayout = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    let layoutFile = "";
    if (settings.layout.includes(".hbs") || settings.layout.includes(".html")) {
        layoutFile = yield readFile(path_1.join(process.cwd(), settings.layout)).then((res) => res.toString());
    }
    else {
        layoutFile = yield readFile(path_1.join(__dirname, "../../", `template/${settings.layout}.hbs`)).then((res) => res.toString());
    }
    return Object.assign(Object.assign({}, settings), { layout: layoutFile });
});
exports.createFiles = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    const template = utils_1.Handlebars.compile(settings.layout);
    log.BLOCK_MID("Creating pages");
    yield utils_1.asyncForEach(settings.files, (file) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentLink = file.route.replace("index.html", "");
            const contents = template({
                projectTitle: settings.projectTitle == ""
                    ? settings.package.name
                    : settings.projectTitle,
                title: file.title,
                content: file.html,
                currentLink: currentLink,
                currentId: currentLink.replace(/\//g, " ").trim().replace(/\s+/g, "-"),
                styles: settings.styles ? settings.styles : null,
                scripts: settings.scripts ? settings.scripts : null,
                package: settings.package ? settings.package : null,
                navigation: settings.navigation,
                headerNavigation: _1.getNavigation(settings, "header"),
                sidebarNavigation: _1.getNavigation(settings, "sidebar"),
                footerNavigation: _1.getNavigation(settings, "footer"),
            });
            yield utils_1.writeThatFile(file, prettier_1.default.format(contents, { parser: "html" }));
        }
        catch (err) {
            console.log(err);
        }
    }));
});
exports.copyFolders = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    if (settings.copy.length > 0) {
        log.BLOCK_MID("Copy files/folders");
        yield utils_1.asyncForEach(settings.copy, (folder) => __awaiter(void 0, void 0, void 0, function* () {
            yield ncp(folder, settings.output + "/" + folder.split("/")[folder.split("/").length - 1], (err) => {
                if (!err)
                    log.BLOCK_LINE_SUCCESS(folder);
                else
                    console.log(err);
            });
        }));
    }
});
//# sourceMappingURL=page.js.map