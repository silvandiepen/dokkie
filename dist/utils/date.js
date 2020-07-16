"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToDate = void 0;
const helpers_1 = require("./helpers");
exports.convertToDate = (date) => {
    let d = date;
    if (typeof d == "string")
        d = d.replace(/-|\s/g, "");
    else
        d = d.toString();
    d = helpers_1.splice(helpers_1.splice(d.toString(), 4, 0, "-"), 7, 0, "-");
    return new Date(d);
};
//# sourceMappingURL=date.js.map