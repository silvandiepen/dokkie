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
exports.createFavicons = void 0;
const favicons_1 = __importDefault(require("favicons"));
const log = __importStar(require("cli-block"));
const path_1 = require("path");
const utils_1 = require("../utils");
const { createCanvas } = require("canvas");
const canvas_to_buffer_1 = __importDefault(require("canvas-to-buffer"));
const createFaviconImage = (settings) => {
    const canvas = createCanvas(1024, 1024);
    const ctx = canvas.getContext("2d");
    // Draw line under text
    ctx.font = "800px Georgia";
    let firstLetter = ("" ? settings.package.name : settings.projectTitle)
        .substr(0, 1)
        .toLowerCase();
    ctx.fillStyle = "#cccccc";
    ctx.fillText(firstLetter, 200, 768);
    const frame = new canvas_to_buffer_1.default(canvas);
    return frame.toBuffer();
};
// import * as log from "cli-block";
exports.createFavicons = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const source = settings.favicon
        ? settings.favicon
        : createFaviconImage(settings);
    const config = {
        path: "/img/favicons/",
        appName: (_a = settings.package) === null || _a === void 0 ? void 0 : _a.name,
        appDescription: (_b = settings.package) === null || _b === void 0 ? void 0 : _b.description,
        developerName: (_c = settings.package) === null || _c === void 0 ? void 0 : _c.author,
        developerURL: null,
        dir: "auto",
        lang: "en-US",
        background: "#fff",
        theme_color: "#fff",
        appleStatusBarStyle: "black-translucent",
        display: "standalone",
        orientation: "any",
        scope: "/",
        start_url: "/?homescreen=1",
        version: (_d = settings.package) === null || _d === void 0 ? void 0 : _d.version,
        logging: false,
        pixel_art: false,
        loadManifestWithCredentials: false,
        icons: {
            android: true,
            appleIcon: true,
            appleStartup: false,
            coast: false,
            favicons: true,
            firefox: false,
            windows: true,
            yandex: true,
        },
    };
    log.BLOCK_MID("Create Favicon");
    const faviconData = yield new Promise((resolve, reject) => {
        favicons_1.default(source, config, (error, response) => __awaiter(void 0, void 0, void 0, function* () {
            if (error)
                reject(error);
            resolve(response);
        }));
    }).then((response) => __awaiter(void 0, void 0, void 0, function* () {
        const faviconDest = "img/favicons";
        const writeConfig = (img) => ({
            name: img.name,
            path: path_1.join(settings.output, faviconDest, img.name),
            destpath: path_1.join(settings.output, faviconDest),
            filename: img.name,
            title: path_1.basename(img.name),
            ext: path_1.extname(img.name),
            route: path_1.join(faviconDest, img.name),
        });
        yield utils_1.asyncForEach(response.images, (img) => __awaiter(void 0, void 0, void 0, function* () {
            yield utils_1.writeThatFile(writeConfig(img), img.contents, true);
        }));
        yield utils_1.asyncForEach(response.files, (img) => __awaiter(void 0, void 0, void 0, function* () {
            yield utils_1.writeThatFile(writeConfig(img), img.contents, true);
        }));
        return response;
    }));
    return Object.assign(Object.assign({}, settings), { faviconData: faviconData });
});
//# sourceMappingURL=favicons.js.map