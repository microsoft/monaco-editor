import type * as webpack from 'webpack';

export interface IAddWorkerEntryPointPluginOptions {
	id: string;
	entry: string;
	filename: string;
	chunkFilename?: string;
	plugins: webpack.WebpackPluginInstance[];
}

function getCompilerHook(
	compiler: webpack.Compiler,
	{ id, entry, filename, chunkFilename, plugins }: IAddWorkerEntryPointPluginOptions
) {
	const webpack = compiler.webpack ?? require('webpack');

	return function (
		compilation: webpack.Compilation,
		callback: (error?: Error | null | false) => void
	) {
		const outputOptions = {
			filename,
			chunkFilename,
			publicPath: compilation.outputOptions.publicPath,
			// HACK: globalObject is necessary to fix https://github.com/webpack/webpack/issues/6642
			globalObject: 'this'
		};
		const childCompiler = compilation.createChildCompiler(id, outputOptions, [
			new webpack.webworker.WebWorkerTemplatePlugin(),
			new webpack.LoaderTargetPlugin('webworker')
		]);
		const SingleEntryPlugin = webpack.EntryPlugin ?? webpack.SingleEntryPlugin;
		new SingleEntryPlugin(compiler.context, entry, 'main').apply(childCompiler);
		plugins.forEach((plugin) => plugin.apply(childCompiler));

		childCompiler.runAsChild((err?: Error | null) => callback(err));
	};
}

export class AddWorkerEntryPointPlugin implements webpack.WebpackPluginInstance {
	private readonly options: IAddWorkerEntryPointPluginOptions;

	constructor({
		id,
		entry,
		filename,
		chunkFilename = undefined,
		plugins
	}: IAddWorkerEntryPointPluginOptions) {
		this.options = { id, entry, filename, chunkFilename, plugins };
	}

	apply(compiler: webpack.Compiler) {
		const webpack = compiler.webpack ?? require('webpack');
		const compilerHook = getCompilerHook(compiler, this.options);
		const majorVersion = webpack.version.split('.')[0];
		if (parseInt(majorVersion) < 4) {
			(<any>compiler).plugin('make', compilerHook);
		} else {
			compiler.hooks.make.tapAsync('AddWorkerEntryPointPlugin', compilerHook);
		}
	}
}
