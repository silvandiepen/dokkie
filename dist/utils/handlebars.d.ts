import H from "handlebars";
export declare const helpers: {
    eq: (v1: any, v2: any) => any;
    ne: (v1: any, v2: any) => any;
    lt: (v1: any, v2: any) => any;
    gt: (v1: any, v2: any) => any;
    lte: (v1: any, v2: any) => any;
    gte: (v1: any, v2: any) => any;
    and(): boolean;
    or(): boolean;
    ternary: (cond: any, v1: any, v2: any) => any;
};
export declare const Handlebars: typeof H;
