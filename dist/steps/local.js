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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLocalConfig = exports.loadLocalConfig = exports.getPackageInformation = void 0;
const { readFile } = require("fs").promises;
const log = __importStar(require("cli-block"));
exports.getPackageInformation = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let PackageData = yield readFile("package.json").then((res) => res.toString());
        return Object.assign(Object.assign({}, settings), { package: JSON.parse(PackageData) });
    }
    catch (err) {
        // console.log(err);
    }
    return settings;
});
// Load the local confi and show
exports.loadLocalConfig = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let configData = yield readFile("dokkie.config.json").then((res) => JSON.parse(res.toString()));
        log.BLOCK_MID("Local configuration");
        log.BLOCK_SETTINGS(configData);
        return Object.assign(Object.assign({}, settings), { localConfig: configData });
    }
    catch (err) {
        // console.log(err);
    }
    return settings;
});
// Set the local config to the settings
exports.setLocalConfig = (settings) => {
    if (settings.localConfig) {
        if (settings.localConfig.input)
            settings.input = settings.localConfig.input;
        if (settings.localConfig.output)
            settings.output = settings.localConfig.output;
        if (settings.localConfig.layout)
            settings.layout = settings.localConfig.layout;
        if (settings.localConfig.cleanBefore)
            settings.cleanBefore = settings.localConfig.cleanBefore;
        if (settings.localConfig.theme)
            settings.theme = settings.localConfig.theme;
        if (settings.localConfig.extensions)
            settings.extensions = settings.localConfig.extensions;
        if (settings.localConfig.excludeFolders)
            settings.excludeFolders = settings.localConfig.excludeFolders;
        if (settings.localConfig.copy)
            settings.copy = settings.localConfig.copy;
        if (settings.localConfig.strip)
            settings.strip = settings.localConfig.strip;
        if (settings.localConfig.flatNavigation)
            settings.flatNavigation = settings.localConfig.flatNavigation;
        if (settings.localConfig.skip)
            settings.skip = settings.localConfig.skip;
        if (settings.localConfig.showNavigation)
            settings.showNavigation = settings.localConfig.showNavigation.map((option) => {
                if (typeof option == "string") {
                    return {
                        name: option,
                        mobile: true,
                        desktop: true,
                    };
                }
                else
                    return option;
            });
        if (settings.localConfig.injectHtml)
            settings.injectHtml = settings.localConfig.injectHtml;
        if (settings.localConfig.projectTitle)
            settings.projectTitle = settings.localConfig.projectTitle;
        if (settings.localConfig.type)
            settings.type = settings.localConfig.type;
    }
    return settings;
};
//# sourceMappingURL=local.js.map