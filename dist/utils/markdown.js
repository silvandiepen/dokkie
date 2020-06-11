"use strict";
// Markdown
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
exports.getTitleFromMD = exports.mdToHtml = void 0;
const markdown_it_meta_1 = __importDefault(require("markdown-it-meta"));
const markdown_it_prism_1 = __importDefault(require("markdown-it-prism"));
const markdown_it_anchor_1 = __importDefault(require("markdown-it-anchor"));
const markdown_it_html5_media_1 = require("markdown-it-html5-media");
const markdown_it_emoji_1 = __importDefault(require("markdown-it-emoji"));
const markdown_it_1 = __importDefault(require("markdown-it"));
const markdown_it_task_lists_1 = __importDefault(require("markdown-it-task-lists"));
const markdown_it_alert_1 = __importDefault(require("markdown-it-alert"));
const md = new markdown_it_1.default({
    html: true,
    linkify: true,
    breaks: true,
    typographer: true,
});
md.use(markdown_it_meta_1.default);
md.use(markdown_it_prism_1.default);
md.use(markdown_it_anchor_1.default);
md.use(markdown_it_html5_media_1.html5Media);
md.use(markdown_it_emoji_1.default);
md.use(markdown_it_alert_1.default);
md.use(markdown_it_task_lists_1.default, { enabled: true });
/*
    Convert Markdown Data to html and filter meta.
*/
exports.mdToHtml = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const renderedDocument = md.render(file.data);
    const meta = md.meta;
    md.meta = {};
    return {
        document: renderedDocument,
        meta: meta,
    };
});
/*
    Find the first occurence of a string after a certain index.
*/
const findAfter = (str, needle, afterIndex) => {
    for (let i = 0; i < str.length; i++)
        if (str[i] === needle && i > afterIndex)
            return i;
    return 0;
};
/*
    Get the title from a Markdown String
*/
exports.getTitleFromMD = (str, clean = true) => {
    let startTitle = str.indexOf("# ");
    // console.log("index -1:  ", str.charAt(startTitle - 1));
    while (str.charAt(startTitle - 1) == "#") {
        startTitle = findAfter(str, "# ", startTitle);
        console.log("doing the while", startTitle);
    }
    // console.log(startTitle);
    let endTitle = findAfter(str, "\n", startTitle);
    if (startTitle < 0)
        return null;
    if (startTitle > -1 && endTitle == 0)
        endTitle = str.length;
    if (clean)
        return str.substr(startTitle + 2, endTitle).split("\n")[0];
    return str.substr(startTitle, endTitle).split("\n")[0];
};
//# sourceMappingURL=markdown.js.map