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
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNavigation = exports.getTitle = exports.writeThatFile = exports.makeFileName = exports.makePath = exports.makeRoute = exports.asyncForEach = void 0;
const { writeFile, mkdir } = require("fs").promises;
const path_1 = require("path");
const markdown_1 = require("./markdown");
const log = __importStar(require("cli-block"));
exports.asyncForEach = (array, callback) => __awaiter(void 0, void 0, void 0, function* () {
    for (let index = 0; index < array.length; index++) {
        yield callback(array[index], index, array);
    }
});
exports.makeRoute = (file, settings) => {
    const pre = path_1.join(process.cwd()).replace(/\/$/, "");
    const post = path_1.dirname(file.path).replace(pre, "");
    const route = path_1.join(post, exports.makeFileName(file));
    return route;
};
exports.makePath = (file, settings) => {
    const pre = path_1.join(process.cwd()).replace(/\/$/, "");
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
exports.writeThatFile = (file, contents) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.join(file.destpath, file.filename);
        yield createFolder(path_1.dirname(filePath));
        yield writeFile(filePath, contents);
        log.BLOCK_ROW_LINE([file.name, file.route]);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getTitle = (file) => __awaiter(void 0, void 0, void 0, function* () {
    if (file.meta && file.meta.title) {
        return file.meta.title;
    }
    else if (file.ext === ".md" && markdown_1.getTitleFromMD(file.data)) {
        return markdown_1.getTitleFromMD(file.data);
    }
    else {
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