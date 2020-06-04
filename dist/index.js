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
const buildDokkie = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    return settings;
});
buildDokkie(settings_1.settings())
    .then((s) => {
    log.START("Creating Your documentation");
    log.BLOCK_START();
    log.BLOCK_LINE("Dokkie is now building your documentation");
    return s;
})
    .then(steps_1.loadLocalConfig)
    .then(steps_1.setLocalConfig)
    .then((s) => {
    settings_1.logSettings(s);
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
    .then(steps_1.buildNavigation)
    .then((s) => __awaiter(void 0, void 0, void 0, function* () {
    yield steps_1.cleanFolder(s);
    yield steps_1.createFiles(s);
    yield utils_1.createFavicons(s);
    yield steps_1.copyFolders(s);
    return s;
}))
    .then(() => {
    setTimeout(() => {
        log.BLOCK_END("Done :)");
    }, 10);
});
//# sourceMappingURL=index.js.map