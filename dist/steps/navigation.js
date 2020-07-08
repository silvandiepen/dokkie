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
    if (settings.extendNavigation)
        settings.extendNavigation.forEach((item) => {
            if (!item.parent)
                item.parent = "";
            nav.push(item);
        });
    if (settings.overruleNavigation) {
        // When it's a blog. None of the menu's should be shown by default. So, first all items found
        // are put into the menu 'overview'. Then the overruled menus will be added to their respective menus.
        if (settings.type == "blog") {
            nav.forEach((item) => (item.meta.menu = ["overview"]));
            settings.overruleNavigation.forEach((item) => {
                if (!item.parent)
                    item.parent = "";
                nav.push(item);
            });
        }
        // 1. Otherwise, for docs all items will first be given menus in case they don't have them defined yet (which usually)
        // results in appearing in all menus.
        // 2. Then a list will be made of the menu's which will be overruled.
        // 3. These menus will be emptied.
        else {
            // 1.
            const menus = settings.overruleNavigation.map((item) => {
                var _a;
                if ((_a = item.meta) === null || _a === void 0 ? void 0 : _a.menu)
                    return item;
                else
                    return Object.assign(Object.assign({}, item), { meta: Object.assign(Object.assign({}, item.meta), { menu: ["header", "footer", "sidebar"] }) });
            });
            // 2.
            const overruleMenus = [];
            menus.forEach((item) => overruleMenus.push(item.meta.menu));
            // 3.
            overruleMenus.forEach((menu) => {
                nav = nav
                    .map((item) => {
                    var _a;
                    return ((_a = item.meta) === null || _a === void 0 ? void 0 : _a.menu.find(menu, menu.name == menu)) ? Object.assign(Object.assign({}, item), { meta: Object.assign(Object.assign({}, item.meta), { menu: item.meta.menu.filter((item) => item.name !== menu) }) }) : item;
                })
                    .filter((item) => item.meta.menu !== []);
            });
            nav = settings.overruleNavigation.map((item) => (item = Object.assign(Object.assign({}, item), { parent: item.parent || "" })));
        }
    }
    // Flat navigation can be an option.
    let newNav = [];
    if (!settings.flatNavigation)
        nav
            .filter((item) => item.parent == "")
            .forEach((item) => {
            newNav.push(Object.assign(Object.assign({}, item), { children: nav.filter((subitem) => subitem.parent.includes(item.self) && item.self !== "") }));
        });
    // If the project is a blog. The menu's are sorted by date.
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
        if (!((_a = item.meta) === null || _a === void 0 ? void 0 : _a.menu) || (item.meta.menu && item.meta.menu.includes(parent)))
            if (item.children)
                return Object.assign(Object.assign({}, item), { children: filterNavigation(item.children, parent).filter(Boolean) });
            else
                return Object.assign({}, item);
    });
    return filteredNav;
};
exports.getNavigation = (settings, filter) => {
    var _a;
    const current = (_a = settings.showNavigation) === null || _a === void 0 ? void 0 : _a.find((nav) => nav.name == filter);
    if (current)
        return Object.assign(Object.assign({}, current), { menu: filterNavigation(Array.from(settings.navigation), filter).filter(Boolean), showClass: `${current.mobile ? "" : "hide-mobile"} ${current.desktop ? "show-desktop" : "hide-desktop"}` });
    return null;
};
//# sourceMappingURL=navigation.js.map