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
exports.createFavicons = void 0;
// import favicons from "favicons";
const iconator_1 = __importDefault(require("iconator"));
const { createCanvas } = require("canvas");
const canvas_to_buffer_1 = __importDefault(require("canvas-to-buffer"));
const path_1 = require("path");
const createFaviconImage = (settings) => {
    const canvas = createCanvas(1024, 1024);
    const ctx = canvas.getContext("2d");
    // Draw line under text
    ctx.font = "800px Helvetica";
    let firstLetter = ("" ? settings.package.name : settings.projectTitle).substr(0, 1);
    ctx.fillStyle = "#7f7f7f"; // Most mid-color, so it will always be visible.
    ctx.fillText(firstLetter, 200, 768);
    const frame = new canvas_to_buffer_1.default(canvas);
    return frame.toBuffer();
};
exports.createFavicons = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (settings.skip.includes("favicons"))
        return settings;
    const source = ((_a = settings.assets) === null || _a === void 0 ? void 0 : _a.favicon) ? settings.assets.favicon
        : createFaviconImage(settings);
    const faviconDest = "img/favicons";
    // const faviconData = {
    // 	icons: [],
    // 	html: [],
    // 	settings: {
    // 		input: "",
    // 		output: "",
    // 		destination: "",
    // 		color: "",
    // 		appleStatusBarStyle: "",
    // 		themeColor: "",
    // 		appName: "",
    // 		appDeveloper: "",
    // 		appDeveloperUrl: "",
    // 		appDescription: "",
    // 		url: "",
    // 	},
    // };
    const faviconData = yield iconator_1.default({
        input: source,
        output: path_1.join(settings.output, faviconDest),
        appName: (_b = settings.package) === null || _b === void 0 ? void 0 : _b.name,
        appDescription: (_c = settings.package) === null || _c === void 0 ? void 0 : _c.description,
        appDeveloper: (_d = settings.package) === null || _d === void 0 ? void 0 : _d.author,
        appDeveloperUrl: null,
        color: "white",
        themeColor: "black",
        destination: faviconDest,
        appleStatusBarStyle: "default",
        logging: ["inline", "minimal"],
        url: settings.url,
    }).then((r) => __awaiter(void 0, void 0, void 0, function* () { return r; }));
    console.log("GODVERDOMMMEEEEEE");
    return Object.assign(Object.assign({}, settings), { faviconData: faviconData });
});
//# sourceMappingURL=favicons.js.map