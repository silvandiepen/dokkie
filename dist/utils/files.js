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
exports.buildNavigation = exports.getTitle = exports.writeThatFile = exports.makeFileName = exports.makePath = exports.makeRoute = exports.asyncForEach = void 0;
const { writeFile, mkdir } = require("fs").promises;
const path_1 = require("path");
const markdown_1 = require("./markdown");
exports.asyncForEach = (array, callback) => __awaiter(void 0, void 0, void 0, function* () {
    for (let index = 0; index < array.length; index++) {
        yield callback(array[index], index, array);
    }
});
exports.makeRoute = (file, settings) => {
    const pre = path_1.join(__dirname, "../../").replace(/\/$/, "");
    const post = path_1.dirname(file.path).replace(pre, "");
    const route = path_1.join(post, exports.makeFileName(file));
    return route;
};
exports.makePath = (file, settings) => {
    const pre = path_1.join(__dirname, "../../").replace(/\/$/, "");
    const post = path_1.dirname(file.path).replace(pre, "");
    const route = path_1.join(pre, settings.output, post);
    return route;
};
exports.makeFileName = (file) => {
    const filename = file.name == "README" || file.name == "Readme" || file.name == "readme"
        ? "index"
        : file.name.toLowerCase() + "/index";
    return filename + ".html";
};
const createFolder = (folder) => __awaiter(void 0, void 0, void 0, function* () {
    yield mkdir(folder, { recursive: true }, () => {
        return;
    });
});
exports.writeThatFile = (file, contents, settings) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.join(file.destpath, file.filename);
        yield createFolder(path_1.dirname(filePath));
        yield writeFile(filePath, contents);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getTitle = (file) => __awaiter(void 0, void 0, void 0, function* () {
    if (file.meta && file.meta.title) {
        console.log("USING meta title", file.meta.title);
        return file.meta.title;
    }
    else if (file.ext === ".md" && markdown_1.getTitleFromMD(file.data)) {
        console.log("USING MD title", markdown_1.getTitleFromMD(file.data));
        return markdown_1.getTitleFromMD(file.data);
    }
    else {
        console.log("USING file title", file.name);
        return file.name;
    }
});
exports.buildNavigation = (settings) => {
    const navigation = [];
    settings.files.forEach((file) => {
        navigation.push({
            name: file.title,
            link: file.route,
        });
    });
    return navigation;
};
//# sourceMappingURL=files.js.map