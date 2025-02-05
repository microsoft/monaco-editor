import type * as webpack from 'webpack';
import type * as MonacoEditorWebpackPlugin from '../index';

export interface IAddWorkerEntryPointPluginOptions {
	id: string;
	label: string;
	entry: string;
	filename: string;
	chunkFilename?: string;
	plugins: webpack.WebpackPluginInstance[];
	pluginInstance: MonacoEditorWebpackPlugin;
}

export function getCompilerHook(
	compiler: webpack.Compiler,
	{
		id,
		entry,
		label,
		filename,
		chunkFilename,
		plugins,
		pluginInstance
	}: IAddWorkerEntryPointPluginOptions
) {
	const webpack = compiler.webpack ?? require('webpack');

	return function (compilation: webpack.Compilation) {
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

		childCompiler.hooks.compilation.tap(AddWorkerEntryPointPlugin.name, (childCompilation) => {
			childCompilation.hooks.afterOptimizeAssets.tap(AddWorkerEntryPointPlugin.name, (_assets) => {
				// one entry may generate many assets，we can not distinguish which is the entry bundle，so we get the entry bundle by entrypoint
				const entrypoint = childCompilation.entrypoints.get(entryNameWithoutExt);
				const chunks = entrypoint?.chunks;
				if (chunks) {
					const chunk = [...chunks]?.[0];

					pluginInstance.workerPathsMap[label] = [...chunk.files]?.[0];
					pluginInstance.workerTaskActions[label]?.resolve?.();
				}
			});
		});

		const SingleEntryPlugin = webpack.EntryPlugin ?? webpack.SingleEntryPlugin;
		if (!label) {
			console.warn(`Please set label in customLanguage (expected a string)`);
		}

		const entryName = entry.split('/').pop();
		const entryNameWithoutExt = entryName?.split('.').slice(0, 1).join('.') ?? 'main';
		new SingleEntryPlugin(compiler.context, entry, entryNameWithoutExt).apply(childCompiler);

		plugins.forEach((plugin) => plugin.apply(childCompiler));

		childCompiler.runAsChild((err?: Error | null) => {
			if (err) {
				console.error(`${AddWorkerEntryPointPlugin.name} childCompiler error`, err);
				pluginInstance.workerTaskActions[label]?.reject?.(err);
			}
		});
	};
}

export class AddWorkerEntryPointPlugin implements webpack.WebpackPluginInstance {
	private readonly options: IAddWorkerEntryPointPluginOptions;

	constructor({
		id,
		label,
		entry,
		filename,
		chunkFilename = undefined,
		plugins,
		pluginInstance
	}: IAddWorkerEntryPointPluginOptions) {
		this.options = {
			id,
			label,
			entry,
			filename,
			chunkFilename,
			plugins,
			pluginInstance
		};
	}

	apply(compiler: webpack.Compiler) {
		const webpack = compiler.webpack ?? require('webpack');
		const compilerHook = getCompilerHook(compiler, this.options);
		const majorVersion = webpack.version.split('.')[0];
		if (parseInt(majorVersion) < 4) {
			(<any>compiler).plugin('make', compilerHook);
		} else {
			compiler.hooks.make.tap(AddWorkerEntryPointPlugin.name, compilerHook);
		}
	}
}
