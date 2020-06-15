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
exports.Handlebars = exports.helpers = void 0;
const handlebars_1 = __importDefault(require("handlebars"));
const format_1 = __importDefault(require("date-fns/format"));
const cli_block_1 = require("cli-block");
const path_1 = require("path");
const { readFile } = require("fs").promises;
exports.helpers = {
    eq: (v1, v2) => v1 === v2,
    ne: (v1, v2) => v1 !== v2,
    lt: (v1, v2) => v1 < v2,
    gt: (v1, v2) => v1 > v2,
    lte: (v1, v2) => v1 <= v2,
    gte: (v1, v2) => v1 >= v2,
    includes: (v1, v2) => v1.includes(v2),
    and() {
        return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    },
    ternary: function (cond, v1, v2) {
        return cond ? v1 : v2;
    },
    //  usage: {{dateFormat date format="MMMM YYYY"}}
    dateFormat: function (context, block) {
        const f = block.hash.format || "MMM Do, YYYY";
        return format_1.default(new Date(context), f);
    },
};
const partials = [
    "headerNavigation",
    "footerNavigation",
    "sidebarNavigation",
    "overviewNavigation",
    "projectTitle",
];
// const enhance = ["page-transition"];
const registerHandlebarPartial = (partial, dir) => __awaiter(void 0, void 0, void 0, function* () {
    const partialTemplate = path_1.join(process.cwd(), "template", dir, `${partial}.hbs`);
    try {
        const file = yield readFile(partialTemplate).then((r) => r.toString());
        handlebars_1.default.registerPartial(partial, file);
    }
    catch (err) {
        throw new Error(`${partialTemplate} doesn't exist`);
    }
});
cli_block_1.asyncForEach(partials, (partial) => __awaiter(void 0, void 0, void 0, function* () {
    yield registerHandlebarPartial(partial, "partials");
    console.log(handlebars_1.default.partials);
}));
// asyncForEach(enhance, async (partial: string) => {
// 	await registerPartial(partial, "enhance");
// });
Object.keys(exports.helpers).forEach((helper) => {
    handlebars_1.default.registerHelper(helper, exports.helpers[helper]);
});
exports.Handlebars = handlebars_1.default;
//# sourceMappingURL=handlebars.js.map