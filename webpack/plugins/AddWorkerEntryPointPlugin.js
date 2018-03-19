class AddWorkerEntryPointPlugin {
  constructor(webpack, {
    id,
    entry,
    filename,
    chunkFilename = undefined,
    plugins = undefined,
  }) {
    this.webpack = webpack;
    this.options = { id, entry, filename, chunkFilename, plugins };
  }

  apply(compiler) {
    const webpack = this.webpack;
    const { id, entry, filename, chunkFilename, plugins } = this.options;
    compiler.hooks.make.tapAsync('AddWorkerEntryPointPlugin', (compilation, callback) => {
      const outputOptions = {
        filename,
        chunkFilename,
        publicPath: compilation.outputOptions.publicPath,
        // HACK: globalObject is necessary to fix https://github.com/webpack/webpack/issues/6642
        globalObject: 'this',
      };
      const childCompiler = compilation.createChildCompiler(id, outputOptions, [
        new webpack.webworker.WebWorkerTemplatePlugin(),
        new webpack.LoaderTargetPlugin('webworker'),
        new webpack.SingleEntryPlugin(compiler.context, entry, 'main'),
      ]);
      plugins.forEach((plugin) => plugin.apply(childCompiler));
      childCompiler.runAsChild(callback);
    });
  }
}

module.exports = AddWorkerEntryPointPlugin;
