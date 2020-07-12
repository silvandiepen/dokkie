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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
exports.setHomePage = exports.createPageData = exports.copyFolders = exports.createPages = exports.reformInjectHtml = exports.getLayout = exports.filterHiddenPages = exports.convertDataToHtml = void 0;
const utils_1 = require("../utils");
const log = __importStar(require("cli-block"));
const prettier_1 = __importDefault(require("prettier"));
const ncp = require("ncp").ncp;
const _1 = require("./");
const { readFile } = require("fs").promises;
const path_1 = require("path");
// Convert filedata to html.
exports.convertDataToHtml = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    yield utils_1.asyncForEach(settings.files, (file) => __awaiter(void 0, void 0, void 0, function* () {
        switch (file.ext) {
            case ".md":
                const markdownData = yield utils_1.mdToHtml(file);
                file.meta = markdownData.meta;
                file.html = markdownData.document;
                break;
            case ".html":
                file.meta = {};
                file.html = file.data;
                break;
        }
    }));
    return Object.assign(Object.assign({}, settings), { files: settings.files });
});
// Filter files
exports.filterHiddenPages = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    // If the file has a meta remove. Remove it.
    const files = settings.files.filter((file) => { var _a; return ((_a = file.meta) === null || _a === void 0 ? void 0 : _a.remove) ? null : file; });
    return Object.assign(Object.assign({}, settings), { files: files });
});
// Get the layouts
exports.getLayout = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let layoutFile = "";
        if (settings.layout.includes(".hbs") || settings.layout.includes(".html")) {
            layoutFile = yield readFile(path_1.join(process.cwd(), settings.layout)).then((res) => res.toString());
        }
        else {
            layoutFile = yield readFile(path_1.join(__dirname, "../../", `template/${settings.layout}.hbs`)).then((res) => res.toString());
        }
        return Object.assign(Object.assign({}, settings), { layout: layoutFile });
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.reformInjectHtml = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    let Inject = {};
    function isLink(str) {
        if (str.indexOf(".html") > -1)
            return true;
        return false;
    }
    if (settings.injectHtml) {
        yield utils_1.asyncForEach(Object.keys(settings.injectHtml), (option) => __awaiter(void 0, void 0, void 0, function* () {
            if (isLink(settings.injectHtml[option])) {
                try {
                    Inject[option] = yield readFile(settings.injectHtml[option]);
                }
                catch (err) {
                    console.error(err);
                }
            }
            else {
                Inject[option] = settings.injectHtml[option];
            }
        }));
    }
    return Object.assign(Object.assign({}, settings), { injectHtml: Inject });
});
exports.createPages = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const partials = yield utils_1.loadHandlebarsPartials();
    // Register Partials
    yield utils_1.asyncForEach(partials, (partial) => {
        utils_1.Handlebars.registerPartial(partial.name, partial.file);
    });
    const template = utils_1.Handlebars.compile(settings.layout);
    const getOnce = {
        logo: ((_a = settings.assets) === null || _a === void 0 ? void 0 : _a.logo) ? settings.assets.logo : false,
        package: settings.package ? settings.package : false,
        favicon: settings.faviconData ? settings.faviconData.html.join("") : null,
        enhance: settings.enhance,
        skip: settings.skip,
        injectHtml: settings.injectHtml,
        styles: settings.styles ? settings.styles : null,
        scripts: settings.scripts ? settings.scripts : null,
    };
    !settings.logging.includes("silent") && log.BLOCK_MID("Creating pages");
    yield utils_1.asyncForEach(settings.files, (file) => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c, _d;
        // THe file is newer than today, so don't build it (yet).
        if (file.date > new Date())
            return;
        try {
            const currentLink = file.route.replace("index.html", "");
            const contents = template(Object.assign(Object.assign({}, getOnce), { projectTitle: settings.projectTitle == ""
                    ? ((_b = settings.package) === null || _b === void 0 ? void 0 : _b.name) ? settings.package.name
                        : file.title
                    : settings.projectTitle, title: file.title, content: file.html, currentLink: currentLink, currentId: currentLink.replace(/\//g, " ").trim().replace(/\s+/g, "-"), headerNavigation: _1.getNavigation(settings, "header"), sidebarNavigation: _1.getNavigation(settings, "sidebar"), footerNavigation: _1.getNavigation(settings, "footer"), overviewNavigation: _1.getNavigation(settings, "overview"), meta: file.meta, hasMeta: ((_c = file.meta) === null || _c === void 0 ? void 0 : _c.author) || ((_d = file.meta) === null || _d === void 0 ? void 0 : _d.tags) ? true : false, language: settings.language, search: settings.files.length > 1 ? settings.search : false }));
            console.log(file);
            yield utils_1.writeThatFile(file, prettier_1.default.format(contents, { parser: "html" }), settings);
        }
        catch (err) {
            console.log(err);
        }
    }));
});
exports.copyFolders = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    settings.copy = settings.copy.filter((folder) => {
        if (typeof folder === "string")
            return true;
    });
    if (settings.copy.length > 0) {
        !settings.logging.includes("silent") && log.BLOCK_MID("Copy files/folders");
        yield utils_1.asyncForEach(settings.copy, (folder) => __awaiter(void 0, void 0, void 0, function* () {
            yield ncp(folder, settings.output + "/" + folder.split("/")[folder.split("/").length - 1], (err) => {
                if (!err)
                    !settings.logging.includes("silent") &&
                        log.BLOCK_LINE_SUCCESS(folder);
                else
                    console.log(err);
            });
        }));
    }
});
exports.createPageData = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    const file = {
        name: "",
        title: "",
        ext: ".json",
        path: "",
        destpath: path_1.join(settings.output),
        filename: "data.json",
    };
    const fileData = [...settings.files].map((item) => {
        delete item.path;
        delete item.ext;
        delete item.html;
        delete item.destpath;
        delete item.filename;
        return item;
    });
    yield utils_1.writeThatFile(file, JSON.stringify(fileData), settings, true);
});
exports.setHomePage = (settings) => {
    const customHomePage = settings.files.find((file) => { var _a; return (_a = file.meta) === null || _a === void 0 ? void 0 : _a.home; });
    const hasHomePage = settings.files.find((file) => file.route === "/index.html");
    if (customHomePage) {
        settings.files.push(Object.assign(Object.assign({}, customHomePage), { route: "/index.html", filename: "index.html" }));
        return settings;
    }
    else if (hasHomePage) {
        return settings;
    }
    else {
        settings.files.push({
            name: "home",
            path: "",
            ext: ".md",
            date: new Date(),
            data: "",
            meta: { title: "home", hide: true },
            html: "",
            title: "Home",
            route: "/index.html",
            destpath: settings.output,
            filename: "index.html",
        });
        return settings;
    }
};
//# sourceMappingURL=page.js.map