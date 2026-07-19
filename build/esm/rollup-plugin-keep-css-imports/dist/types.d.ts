import { type CompilationOptions, PostCssCompatible } from "./compileSass";
import type { Options as SassOptions } from "sass";
export type KeepCssImportsOptions = OutputOptions & InputOptions & Extensions;
export type StyleRefInfo = {
    /**
     * Collection of files with reference to the current file
     */
    importers: string[];
    /**
     * List of files which are used to render the current file
     */
    watchList: string[];
    /**
     * Emit path
     */
    output?: string;
    /**
     * Processed CSS content to emit
     */
    css?: string | Uint8Array;
    /**
     * Processed CSS content map to emit
     */
    map?: string | Uint8Array;
};
export type StylesMap = Record<string, StyleRefInfo>;
interface Extensions {
    /**
     * Customised SASS (SCSS) processor. If not provided plugin will try to
     * import locally installed `sass` if required
     */
    sass?: CompilationOptions["sass"];
    /**
     * An optional object that allows to provide additional options for the
     * SASS compiler.
     */
    sassOptions?: SassOptions<"async">;
    /**
     * Specifies the list of include paths for SASS to search when resolving imports.
     *
     * Default: `["node_modules/"]`
     */
    includePaths?: string[];
    /**
     * An optional function that allows you to perform additional processing on the
     * generated CSS, such as applying PostCSS plugins.
     */
    postProcessor?: (css: string, map: string, stylesMap: StylesMap) => Promise<PostCssCompatible | string | {
        css: string;
        map?: string;
    }>;
}
type OutputPath = string | "keep" | ((assetId: string) => string);
export interface OutputOptions {
    /**
     * Specifies the file extension for the output CSS files.
     *
     * Default: `".css"`
     */
    outputExt?: string;
    /**
     * Specifies the output directory for the generated CSS files.
     * Relative to Rollup output folder.
     *
     * Default: `"./"`
     */
    outputDir?: string;
    /**
     * Specifies the output path relative to `outputDir` for the generated CSS
     * files.
     * The default value, "keep", preserves the original file paths. It is also
     * possible to provide a custom function to generate output paths based on
     * the input file.
     *
     * Default: `"keep"`
     */
    outputPath?: OutputPath;
    /**
     * Specifies whether to generate source maps for the compiled CSS.
     * Use `"inline"` to inline source maps into CSS files.
     *
     * Default: `false`
     */
    sourceMap?: boolean | "inline";
    /**
     * By default CSS paths will be prefixed with current folder mark `./`.
     * To avoid this for CSS files use `true` or specify RegExp filter.
     *
     * If RegExp filter matches `./` won't be added to the path.
     * This option may be helpful if you have some issues with external
     * modules imports from `node_modules`
     *
     * Default: `false`
     */
    skipCurrentFolderPart?: boolean | RegExp;
}
interface InputOptions {
    /**
     * Regular expression to test if an import should be processed by this plugin
     *
     * Default: `/\.(?:s[ca]|c)ss$/`
     */
    includeRegexp?: RegExp;
}
export interface KeepCssImportsPluginContext {
    allStyleImports: string[];
    modulesWithCss: Set<string>;
    stylesToEmit: StylesMap;
}
export {};
