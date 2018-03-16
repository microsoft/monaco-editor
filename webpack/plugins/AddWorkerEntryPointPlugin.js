class AddWorkerEntryPointPlugin {
  constructor(webpack, { id, entry, output }) {
    this.webpack = webpack;
    this.options = { id, entry, output };
  }

  apply(compiler) {
    const webpack = this.webpack;
    const { id, entry, output } = this.options;
    compiler.plugin('make', (compilation, callback) => {
      const outputOptions = {
        filename: output,
        publicPath: compilation.outputOptions.publicPath,
        // HACK: globalObject is necessary to fix https://github.com/webpack/webpack/issues/6642
        globalObject: 'this',
      };
      const childCompiler = compilation.createChildCompiler(id, outputOptions, [
        new webpack.webworker.WebWorkerTemplatePlugin(),
        new webpack.LoaderTargetPlugin('webworker'),
        new webpack.SingleEntryPlugin(this.context, entry, 'main'),
      ]);
      childCompiler.runAsChild(callback);
    });
  }
}

module.exports = AddWorkerEntryPointPlugin;
