const path = require('path');
const webpack = require('webpack');
const AddWorkerEntryPointPlugin = require('./plugins/AddWorkerEntryPointPlugin');
const INCLUDE_LOADER_PATH = require.resolve('./loaders/include');

const EDITOR_MODULE = {
  label: 'editorWorkerService',
  entry: undefined,
  worker: {
    id: 'vs/editor/editor',
    entry: 'vs/editor/editor.worker',
    output: 'editor.worker.js',
    fallback: undefined
  },
  alias: undefined,
};
const LANGUAGES = require('./languages');
const FEATURES = require('./features');

function resolveMonacoPath(filePath) {
  return require.resolve(path.join('monaco-editor/esm', filePath));
}

const languagesById = fromPairs(
  flatMap(toPairs(LANGUAGES), ([id, language]) =>
    [id].concat(language.alias || []).map((label) => [label, mixin({ label }, language)])
  )
);
const featuresById = mapValues(FEATURES, (feature, key) => mixin({ label: key }, feature))

function getFeaturesIds(userFeatures, predefinedFeaturesById) {
  function notContainedIn(arr) {
    return (element) => arr.indexOf(element) === -1;
  }

  let featuresIds;

  if (userFeatures.length) {
    const excludedFeatures = userFeatures.filter(f => f[0] === '!').map(f => f.slice(1));
    if (excludedFeatures.length) {
      featuresIds = Object.keys(predefinedFeaturesById).filter(notContainedIn(excludedFeatures))
    } else {
      featuresIds = userFeatures;
    }
  } else {
    featuresIds = Object.keys(predefinedFeaturesById);
  }

  return featuresIds;
}

class MonacoWebpackPlugin {
  constructor(options = {}) {
    const languages = options.languages || Object.keys(languagesById);
    const features = getFeaturesIds(options.features || [], featuresById);
    const output = options.output || '';
    this.options = {
      languages: languages.map((id) => languagesById[id]).filter(Boolean),
      features: features.map(id => featuresById[id]).filter(Boolean),
      output,
    };
  }

  apply(compiler) {
    const { languages, features, output } = this.options;
    const publicPath = getPublicPath(compiler);
    const modules = [EDITOR_MODULE].concat(languages).concat(features);
    const workers = modules.map(
      ({ label, alias, worker }) => worker && (mixin({ label, alias }, worker))
    ).filter(Boolean);
    const rules = createLoaderRules(languages, features, workers, output, publicPath);
    const plugins = createPlugins(workers, output);
    addCompilerRules(compiler, rules);
    addCompilerPlugins(compiler, plugins);
  }
}

function addCompilerRules(compiler, rules) {
  const compilerOptions = compiler.options;
  const moduleOptions = compilerOptions.module || (compilerOptions.module = {});
  moduleOptions.rules = (moduleOptions.rules || []).concat(rules);
}

function addCompilerPlugins(compiler, plugins) {
  plugins.forEach((plugin) => plugin.apply(compiler));
}

function getPublicPath(compiler) {
  return compiler.options.output && compiler.options.output.publicPath || '';
}

function createLoaderRules(languages, features, workers, outputPath, publicPath) {
  if (!languages.length && !features.length) { return []; }
  const languagePaths = flatArr(languages.map(({ entry }) => entry).filter(Boolean));
  const featurePaths = flatArr(features.map(({ entry }) => entry).filter(Boolean));
  const workerPaths = fromPairs(workers.map(({ label, output }) => [label, path.join(outputPath, output)]));
  if (workerPaths['typescript']) {
    // javascript shares the same worker
    workerPaths['javascript'] = workerPaths['typescript'];
  }
  if (workerPaths['css']) {
    // scss and less share the same worker
    workerPaths['less'] = workerPaths['css'];
    workerPaths['scss'] = workerPaths['css'];
  }

  if (workerPaths['html']) {
    // handlebars, razor and html share the same worker
    workerPaths['handlebars'] = workerPaths['html'];
    workerPaths['razor'] = workerPaths['html'];
  }

  const globals = {
    'MonacoEnvironment': `(function (paths) {
      function stripTrailingSlash(str) {
        return str.replace(/\\/$/, '');
      }
      return {
        getWorkerUrl: function (moduleId, label) {
          var pathPrefix = (typeof window.__webpack_public_path__ === 'string' ? window.__webpack_public_path__ : ${JSON.stringify(publicPath)});
          return (pathPrefix ? stripTrailingSlash(pathPrefix) + '/' : '') + paths[label];
        }
      };
    })(${JSON.stringify(workerPaths, null, 2)})`,
  };
  return [
    {
      test: /monaco-editor[/\\]esm[/\\]vs[/\\]editor[/\\]editor.(api|main).js/,
      use: [
        {
          loader: INCLUDE_LOADER_PATH,
          options: {
            globals,
            pre: featurePaths.map((importPath) => resolveMonacoPath(importPath)),
            post: languagePaths.map((importPath) => resolveMonacoPath(importPath)),
          },
        },
      ],
    },
  ];
}

function createPlugins(workers, outputPath) {
  return (
    []
    .concat(uniqBy(workers, ({ id }) => id).map(({ id, entry, output }) =>
      new AddWorkerEntryPointPlugin({
        id,
        entry: resolveMonacoPath(entry),
        filename: path.join(outputPath, output),
        plugins: [
          new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
        ],
      })
    ))
  );
}

function flatMap(items, iteratee) {
  return items.map(iteratee).reduce((acc, item) => [].concat(acc).concat(item), []);
}

function flatArr(items) {
  return items.reduce((acc, item) => {
    if (Array.isArray(item)) {
      return [].concat(acc).concat(item);
    }
    return [].concat(acc).concat([item]);
  }, []);
}

function toPairs(object) {
  return Object.keys(object).map((key) => [key, object[key]]);
}

function fromPairs(values) {
  return values.reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {});
}

function mapValues(object, iteratee) {
  return Object.keys(object).reduce(
    (acc, key) => Object.assign(acc, { [key]: iteratee(object[key], key) }),
    {}
  );
}

function uniqBy(items, iteratee) {
  const keys = {};
  return items.reduce((acc, item) => {
    const key = iteratee(item);
    if (key in keys) { return acc; }
    keys[key] = true;
    acc.push(item);
    return acc;
  }, []);
}

function mixin(dest, src) {
  for (let prop in src) {
    if (Object.hasOwnProperty.call(src, prop)) {
      dest[prop] = src[prop];
    }
  }
  return dest;
}

module.exports = MonacoWebpackPlugin;
