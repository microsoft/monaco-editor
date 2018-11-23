import { Plugin } from 'webpack'

interface IMonacoEditorWebpackPluginOpts {
    /**
     * custom output path for worker scripts, relative to the main webpack `output.path`.
     * Defaults to ''.
     */
    output?: string;

    /**
     * Include only a subset of the languages supported.
     */
    languages?: string[];

    /**
     * Include only a subset of the editor features.
     * Use e.g. '!contextmenu' to exclude a certain feature.
     */
    features?: string[];
}

declare class MonacoEditorWebpackPlugin extends Plugin {
    constructor(opts?: IMonacoEditorWebpackPluginOpts)
}

export = MonacoEditorWebpackPlugin
