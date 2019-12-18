import * as webpack from 'webpack';
const webpackVersion = require('webpack/package.json').version;
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const LoaderTargetPlugin = require('webpack/lib/LoaderTargetPlugin');
const WebWorkerTemplatePlugin = require('webpack/lib/webworker/WebWorkerTemplatePlugin');

export interface IAddWorkerEntryPointPluginOptions {
  id: string;
  entry: string;
  filename: string;
  chunkFilename?: string;
  plugins: webpack.Plugin[];
}

function getCompilerHook(compiler: webpack.Compiler, { id, entry, filename, chunkFilename, plugins }: IAddWorkerEntryPointPluginOptions) {
  return function (compilation: webpack.compilation.Compilation, callback: Function) {
    const outputOptions = {
      filename,
      chunkFilename,
      publicPath: compilation.outputOptions.publicPath,
      // HACK: globalObject is necessary to fix https://github.com/webpack/webpack/issues/6642
      globalObject: 'this',
    };
    const childCompiler = (<any>compilation).createChildCompiler(id, outputOptions, [
      new WebWorkerTemplatePlugin(),
      new LoaderTargetPlugin('webworker'),
    ]);
    new SingleEntryPlugin(compiler.context, entry, 'main').apply(childCompiler);
    plugins.forEach((plugin) => plugin.apply(childCompiler));

    childCompiler.runAsChild(callback);
  }
}

export class AddWorkerEntryPointPlugin implements webpack.Plugin {

  private readonly options: IAddWorkerEntryPointPluginOptions;

  constructor({ id, entry, filename, chunkFilename = undefined, plugins }: IAddWorkerEntryPointPluginOptions) {
    this.options = { id, entry, filename, chunkFilename, plugins };
  }

  apply(compiler: webpack.Compiler) {
    const compilerHook = getCompilerHook(compiler, this.options);
    if (webpackVersion < '4') {
      compiler.plugin('make', compilerHook);
    } else {
      compiler.hooks.make.tapAsync('AddWorkerEntryPointPlugin', compilerHook);
    }
  }
}
