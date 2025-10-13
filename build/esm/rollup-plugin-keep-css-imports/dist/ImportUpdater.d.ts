import MagicString from "magic-string";
import type { RenderedChunk } from "rollup";
import { OutputOptions, KeepCssImportsPluginContext } from "./types";
interface ChunkDetails {
    chunk: RenderedChunk;
    bundleOutDir: string;
    moduleRoot: string;
}
export declare class ImportUpdater {
    private _outputOptions;
    private _pluginContext;
    constructor(pluginContext: KeepCssImportsPluginContext, outputOptions: OutputOptions);
    getMagicId(id: string): string;
    updateImports(code: string, chunk: RenderedChunk, bundleOutDir: string, moduleRoot: string): {
        code: string;
        map: import("magic-string").SourceMap;
    };
    updateMatchedImport(m: RegExpMatchArray, magicString: MagicString, chunkDetails: ChunkDetails): void;
    private addImportAndGetNewId;
    private updateChunk;
    private saveAndGetUpdatedImportPath;
    private shouldAddPrefixCurrentDir;
    private resolveOutputPath;
}
export {};
