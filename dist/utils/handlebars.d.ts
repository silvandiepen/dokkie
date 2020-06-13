import H from "handlebars";
export declare const helpers: {
    eq: (v1: any, v2: any) => boolean;
    ne: (v1: any, v2: any) => boolean;
    lt: (v1: any, v2: any) => boolean;
    gt: (v1: any, v2: any) => boolean;
    lte: (v1: any, v2: any) => boolean;
    gte: (v1: any, v2: any) => boolean;
    includes: (v1: string[any], v2: string) => boolean;
    and(): boolean;
    or(): boolean;
    ternary: (cond: any, v1: any, v2: any) => any;
    dateFormat: (context: string, block: any) => string;
};
export declare const Handlebars: typeof H;
