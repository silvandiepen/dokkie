"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const yargs_1 = __importDefault(require("yargs"));
exports.settings = () => {
    const cs = yargs_1.default.options({
        in: {
            required: true,
            type: "string",
            default: ".",
            alias: "input",
        },
        out: {
            required: true,
            type: "string",
            default: "docs",
            alias: "output",
        },
        layout: {
            required: false,
            type: "string",
            default: "default",
        },
        clean: {
            required: false,
            type: "string",
            default: true,
            alias: "cleanBefore",
        },
        theme: {
            required: false,
            type: "string",
            default: "coat",
        },
    }).argv;
    return {
        input: cs.in,
        output: cs.out,
        layout: cs.layout,
        excludeFolders: ["node_modules", "dist", "docs"],
        extensions: [".md"],
        cleanBefore: cs.clean,
        theme: cs.theme,
    };
};
//# sourceMappingURL=settings.js.map