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
exports.getNavigation = exports.cleanFolder = exports.buildNavigation = void 0;
const rimraf_1 = __importDefault(require("rimraf"));
exports.buildNavigation = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    let nav = [];
    settings.files.forEach((file) => {
        var _a, _b;
        const link = file.route.replace("index.html", "");
        const linkPath = link.substr(1, link.length - 2).split("/");
        const parent = linkPath[linkPath.length - 2]
            ? linkPath[linkPath.length - 2]
            : "";
        if (!((_a = file.meta) === null || _a === void 0 ? void 0 : _a.hide))
            nav.push({
                name: file.title,
                link: link,
                path: linkPath,
                self: linkPath[linkPath.length - 1],
                parent: ((_b = file.meta) === null || _b === void 0 ? void 0 : _b.parent) ? file.meta.parent.split(",").map((i) => i.trim())
                    : parent,
                meta: file.meta,
                date: file.date,
            });
    });
    if (settings.extendNavigation) {
        settings.extendNavigation.forEach((item) => {
            if (!item.parent)
                item.parent = "";
            nav.push(item);
        });
        console.log(nav);
    }
    let newNav = [];
    if (!settings.flatNavigation)
        nav
            .filter((item) => item.parent == "")
            .forEach((item) => {
            newNav.push(Object.assign(Object.assign({}, item), { children: nav.filter((subitem) => subitem.parent.includes(item.self) && item.self !== "") }));
        });
    if (settings.type == "blog") {
        nav.sort((a, b) => (a.date < b.date ? 1 : -1));
    }
    return Object.assign(Object.assign({}, settings), { navigation: settings.flatNavigation ? nav : newNav });
});
exports.cleanFolder = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    if (settings.cleanBefore)
        rimraf_1.default.sync(settings.output);
});
const filterNavigation = (nav, parent) => {
    const filteredNav = nav.map((item) => {
        var _a;
        if (!((_a = item.meta) === null || _a === void 0 ? void 0 : _a.menu) ||
            (item.meta.menu && item.meta.menu.includes(parent))) {
            if (item.children)
                return Object.assign(Object.assign({}, item), { children: filterNavigation(item.children, parent).filter(Boolean) });
            else {
                return Object.assign({}, item);
            }
        }
    });
    return filteredNav;
};
exports.getNavigation = (settings, filter) => {
    const current = settings.showNavigation.find((nav) => nav.name == filter);
    if (current)
        return Object.assign(Object.assign({}, current), { menu: filterNavigation(Array.from(settings.navigation), filter).filter(Boolean), showClass: `${current.mobile ? "" : "hide-mobile"} ${current.desktop ? "show-desktop" : "hide-desktop"}` });
    return null;
};
//# sourceMappingURL=navigation.js.map