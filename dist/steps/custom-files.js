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
exports.getScripts = exports.getStyles = void 0;
const utils_1 = require("../utils");
const path_1 = require("path");
const { readFile, writeFile } = require("fs").promises;
const fixGoogleFonts = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const links = [];
        let file = yield readFile(path_1.join(process.cwd(), settings.output, "css", "style.css")).then((r) => r.toString());
        // If there is a google font, automatically add preconnect for gstattic
        if (file.indexOf("https://fonts.googleapis.com/") > -1)
            links.push('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>');
        // Replace Import for css for Link elements.
        let importRegex = new RegExp(/@import.*?[\"\']([^\"\']+)[\"\'].*?;/gi);
        let matches = file.match(importRegex);
        if (matches)
            matches.forEach((match) => {
                file = file.replace(match, "");
                links.push(`<link rel="stylesheet" type="text/css" href="${match.replace(/'/g, '"').match(/"([^']+)"/)[1]}" />`);
            });
        yield writeFile(path_1.join(process.cwd(), settings.output, "css", "style.css"), file);
        return links;
    }
    catch (err) {
        console.log(err);
    }
});
exports.getStyles = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    let styles = [];
    let localCss = false;
    if (settings.theme && !settings.theme.includes("http")) {
        try {
            yield utils_1.download(`https://coat.guyn.nl/css/theme/${settings.theme}.css`, path_1.join(process.cwd(), settings.output, "css", "style.css"));
            styles.push("/css/style.css");
            localCss = true;
        }
        catch (err) {
            console.log(err);
        }
    }
    // If there are addable stylesheets available
    if ((_b = (_a = settings.localConfig) === null || _a === void 0 ? void 0 : _a.add) === null || _b === void 0 ? void 0 : _b.css)
        styles = styles.concat(settings.localConfig.add.css);
    // If there are overruling stylesheets
    if ((_d = (_c = settings.localConfig) === null || _c === void 0 ? void 0 : _c.overrule) === null || _d === void 0 ? void 0 : _d.css)
        styles = (_f = (_e = settings.localConfig) === null || _e === void 0 ? void 0 : _e.overrule) === null || _f === void 0 ? void 0 : _f.css;
    // To Embeddable link scripts
    let stylesScripts = styles.map((s) => (s = `<link rel="stylesheet" type="text/css" media='screen and (min-width: 0px)' href="${s}"/>`));
    // Load preconnect for Google fonts
    if (localCss) {
        const links = yield fixGoogleFonts(settings);
        if (links.length)
            links.forEach((link) => stylesScripts.push(link));
    }
    return Object.assign(Object.assign({}, settings), { styles: stylesScripts.join("") });
});
exports.getScripts = (settings) => {
    var _a, _b, _c, _d;
    let scripts = [];
    // If there are addable stylesheets available
    if ((_b = (_a = settings.localConfig) === null || _a === void 0 ? void 0 : _a.add) === null || _b === void 0 ? void 0 : _b.js)
        scripts = scripts.concat(settings.localConfig.add.js);
    // If there are overruling stylesheets
    if ((_d = (_c = settings.localConfig) === null || _c === void 0 ? void 0 : _c.overrule) === null || _d === void 0 ? void 0 : _d.js)
        scripts = settings.localConfig.overrule.js;
    const scriptScripts = scripts
        .map((s) => (s = `<script type="text/javascript" src="${s}" async></script>`))
        .join("");
    return Object.assign(Object.assign({}, settings), { scripts: scriptScripts });
};
//# sourceMappingURL=custom-files.js.map