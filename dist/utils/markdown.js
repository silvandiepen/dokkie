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
exports.getTitleFromMD = exports.mdToHtml = void 0;
// Markdown
const markdown_it_1 = __importDefault(require("markdown-it"));
const markdown_it_meta_1 = __importDefault(require("markdown-it-meta"));
const md = new markdown_it_1.default();
md.use(markdown_it_meta_1.default);
/*
    Convert Markdown Data to html and filter meta.
*/
exports.mdToHtml = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const renderedDocument = md.render(file.data);
    const meta = md.meta;
    md.meta = [];
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
    const startTitle = str.indexOf("# ");
    const endTitle = findAfter(str, "\n", startTitle);
    if (clean)
        return str.substr(startTitle + 2, endTitle).split("\n")[0];
    return str.substr(startTitle, endTitle).split("\n")[0];
};
//# sourceMappingURL=markdown.js.map