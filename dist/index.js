#!/usr/bin/env node
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
// Filesystem
const log = __importStar(require("cli-block"));
// Functionality
const settings_1 = require("./settings");
const utils_1 = require("./utils");
const steps_1 = require("./steps");
const dist_1 = require("./utils/dist");
const buildDokkie = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    return settings;
});
buildDokkie(settings_1.settings())
    .then(settings_1.getDokkiePackage)
    .then((s) => {
    log.START("Creating Your documentation");
    log.BLOCK_START();
    log.BLOCK_LINE(`Dokkie (${s.dokkie.version}) is now building your documentation`);
    return s;
})
    .then(settings_1.setAlternativeDefaults)
    .then(steps_1.loadLocalConfig)
    .then(steps_1.setLocalConfig)
    .then((s) => {
    log.BLOCK_MID("Settings");
    log.BLOCK_SETTINGS(s, { exclude: ["dokkie"] });
    return s;
})
    .then(steps_1.getFiles)
    .then(steps_1.fileData)
    .then(steps_1.getPackageInformation)
    .then(steps_1.convertDataToHtml)
    .then(steps_1.filterHiddenPages)
    .then(steps_1.setMetadata)
    .then(steps_1.getLayout)
    .then(steps_1.getStyles)
    .then(steps_1.getScripts)
    .then(steps_1.setFileDate)
    .then(steps_1.setHomePage)
    .then(steps_1.reformInjectHtml)
    .then(steps_1.buildNavigation)
    .then((s) => __awaiter(void 0, void 0, void 0, function* () {
    yield steps_1.cleanFolder(s);
    return s;
}))
    .then(utils_1.createFavicons)
    .then(steps_1.downloadAssets)
    .then((s) => __awaiter(void 0, void 0, void 0, function* () {
    yield dist_1.showDist(s);
    yield steps_1.createFiles(s);
    yield steps_1.copyFolders(s);
    return s;
}))
    .then((s) => {
    setTimeout(() => {
        log.BLOCK_END("Done :)");
        dist_1.showDist(s);
    }, 10);
});
//# sourceMappingURL=index.js.map