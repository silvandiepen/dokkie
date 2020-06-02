"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handlebars = exports.helpers = void 0;
const handlebars_1 = __importDefault(require("handlebars"));
exports.helpers = {
    eq: (v1, v2) => v1 === v2,
    ne: (v1, v2) => v1 !== v2,
    lt: (v1, v2) => v1 < v2,
    gt: (v1, v2) => v1 > v2,
    lte: (v1, v2) => v1 <= v2,
    gte: (v1, v2) => v1 >= v2,
    and() {
        return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    },
    ternary: function (cond, v1, v2) {
        return cond ? v1 : v2;
    },
};
Object.keys(exports.helpers).forEach((helper) => {
    handlebars_1.default.registerHelper(helper, exports.helpers[helper]);
});
exports.Handlebars = handlebars_1.default;
//# sourceMappingURL=handlebars.js.map