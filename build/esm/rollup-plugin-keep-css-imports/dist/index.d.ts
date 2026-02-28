import type { Plugin } from "rollup";
import { KeepCssImportsOptions } from "./types";
declare function keepCssImports({ outputExt, outputPath, skipCurrentFolderPart, includeRegexp, sass, postProcessor, sassOptions, ...options }?: KeepCssImportsOptions): Plugin;
export default keepCssImports;
