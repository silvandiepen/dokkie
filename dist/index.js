#!/usr/bin/env node
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
// Filesystem
const { readdir, readFile } = require("fs").promises;
const path_1 = require("path");
const rimraf_1 = __importDefault(require("rimraf"));
// Functionality
const settings_1 = require("./settings");
const handlebars_1 = __importDefault(require("handlebars"));
const utils_1 = require("./utils");
const getFileTree = (dir, settings) => __awaiter(void 0, void 0, void 0, function* () {
    const dirents = yield readdir(dir, { withFileTypes: true });
    const files = yield Promise.all(dirents.map((dirent) => {
        const res = path_1.resolve(dir, dirent.name);
        const ext = path_1.extname(res);
        if ((settings.extensions.includes(ext) || dirent.isDirectory()) &&
            !settings.excludeFolders.includes(dirent.name))
            return dirent.isDirectory()
                ? getFileTree(res, settings)
                : { name: path_1.basename(res).replace(ext, ""), path: res, ext: ext };
        else
            return null;
    }));
    // return files;
    return Array.prototype.concat(...files).filter((r) => r !== null);
});
const getFiles = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield getFileTree(settings.input, settings);
    console.log(files);
    return Object.assign(Object.assign({}, settings), { files: files });
});
const fileData = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    yield utils_1.asyncForEach(settings.files, (file) => __awaiter(void 0, void 0, void 0, function* () {
        file.data = yield getFileData(file);
    }));
    return Object.assign({}, settings);
});
const getFileData = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let fileData = yield readFile(file.path).then((res) => res.toString());
        return fileData;
    }
    catch (err) {
        console.log(err);
    }
});
const toHtml = (settings) => __awaiter(void 0, void 0, void 0, function* () {
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
const getLayout = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    const layoutFile = yield readFile(`template/${settings.layout}.html`).then((res) => res.toString());
    return Object.assign(Object.assign({}, settings), { layout: layoutFile });
});
const createFolder = (settings) => {
    if (settings.cleanBefore)
        rimraf_1.default.sync(settings.output);
    // if (!exists(settings.output)) mkdir(settings.output);
    return settings;
};
const createFiles = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    const template = handlebars_1.default.compile(settings.layout);
    yield utils_1.asyncForEach(settings.files, (file) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const contents = template({
                title: utils_1.getTitle(file),
                content: file.html,
                style: settings.style,
            });
            yield utils_1.writeThatFile(file, contents, settings);
        }
        catch (err) {
            console.log(err);
        }
    }));
    return settings;
});
const setStylesheet = (settings) => {
    return Object.assign(Object.assign({}, settings), { style: `https://coat.guyn.nl/theme/${settings.theme}.css` });
};
getFiles(settings_1.settings())
    .then(fileData)
    .then(toHtml)
    .then(getLayout)
    .then(setStylesheet)
    .then(createFolder)
    .then(createFiles)
    .then((res) => console.log(res));
//# sourceMappingURL=index.js.map