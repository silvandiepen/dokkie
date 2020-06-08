"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToDate = void 0;
const date_fns_1 = require("date-fns");
exports.convertToDate = (date) => date_fns_1.parseISO(date.toString());
//# sourceMappingURL=date.js.map