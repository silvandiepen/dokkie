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
exports.setMetadata = void 0;
const utils_1 = require("../utils");
exports.setMetadata = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield Promise.all(settings.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        return (file = Object.assign(Object.assign({}, file), { title: yield utils_1.getPageTitle(file), route: utils_1.makeRoute(file, settings), destpath: utils_1.makePath(file, settings), filename: utils_1.makeFileName(file) }));
    }))).then((res) => res);
    return Object.assign(Object.assign({}, settings), { files: files });
});
//# sourceMappingURL=meta.js.map