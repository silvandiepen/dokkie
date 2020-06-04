"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScripts = exports.getStyles = void 0;
exports.getStyles = (settings) => {
    var _a, _b, _c, _d, _e, _f;
    let styles = [];
    if (settings.theme && !settings.theme.includes("http")) {
        styles.push(`https://coat.guyn.nl/theme/${settings.theme}.css`);
    }
    // If there are addable stylesheets available
    if ((_b = (_a = settings.localConfig) === null || _a === void 0 ? void 0 : _a.add) === null || _b === void 0 ? void 0 : _b.stylesheets)
        styles = styles.concat(settings.localConfig.add.stylesheets);
    // If there are overruling stylesheets
    if ((_d = (_c = settings.localConfig) === null || _c === void 0 ? void 0 : _c.overrule) === null || _d === void 0 ? void 0 : _d.stylesheets)
        styles = (_f = (_e = settings.localConfig) === null || _e === void 0 ? void 0 : _e.overrule) === null || _f === void 0 ? void 0 : _f.stylesheets;
    // To Embeddable link scripts
    const stylesScripts = styles
        .map((s) => (s = `<link rel="stylesheet" type="text/css" href="${s}"/>`))
        .join("");
    return Object.assign(Object.assign({}, settings), { styles: stylesScripts });
};
exports.getScripts = (settings) => {
    var _a, _b, _c, _d;
    let scripts = [];
    // If there are addable stylesheets available
    if ((_b = (_a = settings.localConfig) === null || _a === void 0 ? void 0 : _a.add) === null || _b === void 0 ? void 0 : _b.scripts)
        scripts = scripts.concat(settings.localConfig.add.scripts);
    // If there are overruling stylesheets
    if ((_d = (_c = settings.localConfig) === null || _c === void 0 ? void 0 : _c.overrule) === null || _d === void 0 ? void 0 : _d.scripts)
        scripts = settings.localConfig.overrule.scripts;
    const scriptScripts = scripts
        .map((s) => (s = `<script type="text/javascript" src="${s}"></script>`))
        .join("");
    return Object.assign(Object.assign({}, settings), { scripts: scriptScripts });
};
//# sourceMappingURL=custom-files.js.map