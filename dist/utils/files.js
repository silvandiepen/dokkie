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
exports.download = exports.getPageTitle = exports.writeThatFile = exports.makeFileName = exports.makePath = exports.makeRoute = exports.asyncForEach = void 0;
const { writeFile, mkdir } = require("fs").promises;
const { createWriteStream } = require("fs");
const path_1 = require("path");
const markdown_1 = require("./markdown");
const log = __importStar(require("cli-block"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const kleur_1 = require("kleur");
exports.asyncForEach = (array, callback) => __awaiter(void 0, void 0, void 0, function* () {
    for (let index = 0; index < array.length; index++) {
        yield callback(array[index], index, array);
    }
});
exports.makeRoute = (file, settings) => {
    const pre = path_1.join(process.cwd()).replace(/\/$/, "");
    const post = path_1.dirname(file.path).replace(pre, "");
    let route = path_1.join(post, exports.makeFileName(file));
    if (settings.input !== ".") {
        settings.strip.push(settings.input);
    }
    if (settings.strip)
        settings.strip.forEach((ignoredPath) => {
            route = route.replace("/" + ignoredPath, "");
        });
    route = route.charAt(0) === "/" ? route : "/" + route;
    return route;
};
exports.makePath = (file, settings) => {
    const pre = path_1.join(process.cwd()).replace(/\/$/, "");
    const post = path_1.dirname(file.path).replace(pre, "");
    let route = path_1.join(pre, settings.output, post);
    if (settings.strip)
        settings.strip.forEach((ignoredPath) => {
            route = route.replace("/" + ignoredPath, "");
        });
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
exports.writeThatFile = (file, contents, simple = false) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.join(file.destpath, file.filename);
        yield createFolder(path_1.dirname(filePath));
        yield writeFile(filePath, contents);
        log.BLOCK_LINE_SUCCESS(file.title);
        if (!simple) {
            // log.BLOCK_LINE(`${file.name}${file.ext}`);
            log.BLOCK_LINE(`→ ${kleur_1.blue(file.route)}`);
            log.BLOCK_LINE();
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.getPageTitle = (file) => {
    if (file.meta && file.meta.title) {
        return file.meta.title;
    }
    else if (file.ext === ".md" && markdown_1.getTitleFromMD(file.data)) {
        return markdown_1.getTitleFromMD(file.data);
    }
    else {
        return file.name;
    }
};
exports.download = (url, destination) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield node_fetch_1.default(url);
    yield new Promise((resolve, reject) => {
        var _a, _b;
        const fileStream = createWriteStream(destination);
        (_a = res.body) === null || _a === void 0 ? void 0 : _a.pipe(fileStream);
        (_b = res.body) === null || _b === void 0 ? void 0 : _b.on("error", (err) => {
            reject(err);
        });
        fileStream.on("finish", function () {
            resolve();
        });
    });
});
//# sourceMappingURL=files.js.map