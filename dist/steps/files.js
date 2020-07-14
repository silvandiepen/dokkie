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
exports.setFileDate = exports.cleanupFilePathAfterOrder = exports.concatPartials = exports.sectionPartials = exports.getFileData = exports.fileData = exports.getFiles = exports.getFileTree = void 0;
const { readdir, readFile, stat } = require("fs").promises;
const path_1 = require("path");
const utils_1 = require("../utils");
const markdown_1 = require("../utils/markdown");
/*
    ::getFileTree
    Get all files and folders from the input
*/
exports.getFileTree = (dir, settings) => __awaiter(void 0, void 0, void 0, function* () {
    const dirents = yield readdir(dir, { withFileTypes: true });
    const files = yield Promise.all(dirents.map((dirent) => __awaiter(void 0, void 0, void 0, function* () {
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
/*
    ::getFiles
    Get all files based on a fileTree from the input folder.
*/
exports.getFiles = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all pages and order them by Path.
    const files = yield (yield exports.getFileTree(settings.input, settings)).sort((a, b) => (a.path > b.path ? 1 : -1));
    return Object.assign(Object.assign({}, settings), { files: files });
});
/*
    ::fileData
    Go through all files and there data.
*/
exports.fileData = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    yield utils_1.asyncForEach(settings.files, (file, index) => __awaiter(void 0, void 0, void 0, function* () {
        settings.files[index].data = yield exports.getFileData(file);
    }));
    return settings;
});
/*
    ::	getFileData
    Get the file data from a given file.
*/
exports.getFileData = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let fileData = yield readFile(file.path).then((res) => res.toString());
        return fileData;
    }
    catch (err) {
        console.log(err);
    }
});
const getLocalPath = (file, settings) => file.replace(path_1.join(__dirname, "../../"), "").replace(settings.output, "");
/*
    ::concatParitials
    Get all partials and add them to the parent or as a contents array.
*/
exports.sectionPartials = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    const removeIndexes = [];
    yield utils_1.asyncForEach(settings.files, (file, index) => __awaiter(void 0, void 0, void 0, function* () {
        if (getLocalPath(file.path, settings).indexOf("/_") > 0) {
            const parentIndex = settings.files.findIndex((parentFile) => parentFile.path == path_1.join(file.path, "../../readme.md"));
            // If the file doesnt have sections yet, add them.
            if (!settings.files[parentIndex].sections)
                settings.files[parentIndex].sections = [];
            settings.files[parentIndex].sections.push(Object.assign(Object.assign({}, file.contents), { data: file.data }));
            // Remove the file from the list.
            removeIndexes.push(index);
        }
    }));
    // Remove them all, order the indexes from high to low to not remove the wrong pages.
    yield utils_1.asyncForEach(removeIndexes.sort((a, b) => b - a), (index) => {
        settings.files.splice(index, 1);
    });
    return settings;
});
/*
    ::concatParitials
    Get all partials and add them to the parent or as a contents array.
*/
exports.concatPartials = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    const removeIndexes = [];
    yield utils_1.asyncForEach(settings.files, (file, index) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (file.name.indexOf("_") == 0) {
            const parentIndex = settings.files.findIndex((parentFile) => parentFile.path == file.path.replace(file.name, "readme"));
            // Check if the Parent has a layout defined.
            const parentData = yield markdown_1.mdToHtml(settings.files[parentIndex]);
            // Based on the template, get the classes
            function getColumnClasses(layout) {
                switch (layout) {
                    case "full":
                        return "small-full medium-full";
                    case "half":
                        return "small-full medium-half";
                    case "third":
                    case "thirds":
                        return "small-full medium-third";
                    case "quarter":
                        return "small-half medium-quarter";
                    default:
                        return "small-full";
                }
            }
            // If the parent has a layout, the partials will be stored as contents.
            if ((_a = parentData.meta) === null || _a === void 0 ? void 0 : _a.layout) {
                if (!settings.files[parentIndex].contents)
                    settings.files[parentIndex].contents = {
                        articles: [],
                        name: settings.files[parentIndex].name,
                        layout: parentData.meta.layout,
                        classes: getColumnClasses(parentData.meta.layout),
                        background: parentData.meta.background
                            ? parentData.meta.background
                            : false,
                    };
                settings.files[parentIndex].contents.articles.push({
                    data: file.data,
                });
            }
            // Otherwise, the partials will be added automatically to the parent.
            else {
                // Add the data to the parent
                settings.files[parentIndex].data =
                    settings.files[parentIndex].data + file.data;
            }
            // Remove the file from the list.
            removeIndexes.push(index);
        }
    }));
    // Remove them all, order the indexes from high to low to not remove the wrong pages.
    yield utils_1.asyncForEach(removeIndexes.sort((a, b) => b - a), (index) => {
        settings.files.splice(index, 1);
    });
    return settings;
});
/*
    ::cleanupFilePathAfterOrder
    Cleanup the paths and names when they have characters
    to make partials or order purposes.
*/
exports.cleanupFilePathAfterOrder = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    yield utils_1.asyncForEach(settings.files, (file, index) => {
        // Check prefix in filename
        // Fix the name
        if (settings.files[index].name.indexOf(":") > 0)
            settings.files[index].name = settings.files[index].name.split(":")[1];
        // Check prefix in routes
        // Fix the route
        if (settings.files[index].path.indexOf(":") > 0)
            settings.files[index].path = settings.files[index].path
                .split("/")
                .map((partial) => {
                if (partial.indexOf(":") > 0) {
                    return partial.split(":")[1];
                }
                else
                    return partial;
            })
                .join("/");
    });
    return settings;
});
/*
    :: setFileDate
    If the file doesn't have a provided date through meta. Use the creation date of the file.
*/
exports.setFileDate = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    settings.files = settings.files.map((file) => {
        return Object.assign(Object.assign({}, file), { date: file.meta && file.meta.date
                ? file.meta.date.toString().length == 8
                    ? utils_1.convertToDate(file.meta.date)
                    : new Date(file.meta.date)
                : file.date });
    });
    return settings;
});
//# sourceMappingURL=files.js.map