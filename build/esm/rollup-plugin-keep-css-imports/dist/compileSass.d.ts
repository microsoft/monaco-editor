import type { AsyncCompiler, Options } from "sass";
type SassAsyncCompiler = Pick<AsyncCompiler, "compileAsync" | "compileStringAsync">;
export type PostCssCompatible = {
    process: (css: string, opt: {
        from: string;
        to: string;
        map: {
            prev: string;
            inline: boolean;
        } | null;
    }) => string | {
        css: string;
        map?: string;
    };
};
export interface CompilationOptions {
    outputExt: string;
    sass?: SassAsyncCompiler;
    postProcessor?: (css: string, map: string) => Promise<PostCssCompatible | string | {
        css: string;
        map?: string;
    }>;
    loadPaths?: string[];
    sourceMap?: boolean;
    sassOptions: Options<"async">;
}
export declare const compileSass: (sassPath: string, outWatchList: string[] | undefined, { outputExt, sass, postProcessor, loadPaths, sourceMap, sassOptions }: CompilationOptions) => Promise<{
    css: string;
    map: string;
}>;
export {};
