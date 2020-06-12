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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFileDate = exports.getFileData = exports.fileData = exports.getFiles = exports.getFileTree = void 0;
const { readdir, readFile, stat } = require("fs").promises;
const path_1 = require("path");
const utils_1 = require("../utils");
exports.getFileTree = (dir, settings) => __awaiter(void 0, void 0, void 0, function* () {
    const dirents = yield readdir(dir, { withFileTypes: true });
    const files = yield Promise.all(dirents.map((dirent) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(dirent);
        const res = path_1.resolve(dir, dirent.name);
        const ext = path_1.extname(res);
        const date = yield stat(res);
        if ((settings.extensions.includes(ext) ||
            settings.extensions.includes("*") ||
            dirent.isDirectory()) &&
            !settings.excludeFolders.includes(dirent.name))
            return dirent.isDirectory()
                ? exports.getFileTree(res, settings)
                : {
                    name: path_1.basename(res).replace(ext, ""),
                    path: res,
                    ext: ext,
                    date: new Date(date.birthtime),
                };
        else
            return null;
    })));
    return Array.prototype.concat(...files).filter((r) => r !== null);
});
exports.getFiles = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield exports.getFileTree(settings.input, settings);
    return Object.assign(Object.assign({}, settings), { files: files });
});
exports.fileData = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    yield utils_1.asyncForEach(settings.files, (file) => __awaiter(void 0, void 0, void 0, function* () {
        file.data = yield exports.getFileData(file);
    }));
    return Object.assign({}, settings);
});
exports.getFileData = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let fileData = yield readFile(file.path).then((res) => res.toString());
        return fileData;
    }
    catch (err) {
        console.log(err);
    }
});
exports.setFileDate = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    const files = settings.files.map((file) => {
        return Object.assign(Object.assign({}, file), { date: file.meta && file.meta.date
                ? file.meta.date.toString().length == 8
                    ? utils_1.convertToDate(file.meta.date)
                    : new Date(file.meta.date)
                : file.date });
    });
    return Object.assign(Object.assign({}, settings), { files: files });
});
//# sourceMappingURL=files.js.map