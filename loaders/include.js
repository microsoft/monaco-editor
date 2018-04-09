const loaderUtils = require('loader-utils');

module.exports.pitch = function pitch(remainingRequest) {
  const { globals = undefined, pre = [], post = [] } = loaderUtils.getOptions(this) || {};

  // HACK: NamedModulesPlugin overwrites existing modules when requesting the same module via
  // different loaders, so we need to circumvent this by appending a suffix to make the name unique
  // See https://github.com/webpack/webpack/issues/4613#issuecomment-325178346 for details
  this._module.userRequest = `include-loader!${this._module.userRequest}`;

  return [
    ...(globals
      ? Object.keys(globals).map((key) => `self[${JSON.stringify(key)}] = ${globals[key]};`)
      : []
    ),
    ...pre.map((include) => `require(${loaderUtils.stringifyRequest(this, include)});`),
    `module.exports = require(${loaderUtils.stringifyRequest(this, `!!${remainingRequest}`)});`,
    ...post.map((include) => `require(${loaderUtils.stringifyRequest(this, include)});`),
  ].join('\n');
};
