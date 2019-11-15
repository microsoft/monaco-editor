import { Plugin } from 'webpack'

interface IMonacoEditorWebpackPluginOpts {
    /**
     * Include only a subset of the languages supported.
     */
    languages?: string[];

    /**
     * Include only a subset of the editor features.
     * Use e.g. '!contextmenu' to exclude a certain feature.
     */
    features?: string[];

    /**
     * Specify a filename template to use for generated files.
     * Use e.g. '[name].worker.[contenthash].js' to include content-based hashes.
     */
    filename?: string;
}

declare class MonacoEditorWebpackPlugin extends Plugin {
    constructor(opts?: IMonacoEditorWebpackPluginOpts)
}

export = MonacoEditorWebpackPlugin
