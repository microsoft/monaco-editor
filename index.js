const path = require('path');
const webpack = require('webpack');
const AddWorkerEntryPointPlugin = require('./plugins/AddWorkerEntryPointPlugin');
const INCLUDE_LOADER_PATH = require.resolve('./loaders/include');

const IGNORED_IMPORTS = {
  [resolveMonacoPath('vs/language/typescript/lib/typescriptServices')]: [
    'fs',
    'path',
    'os',
    'crypto',
    'source-map-support',
  ],
};
const MONACO_EDITOR_API_PATHS = [
  resolveMonacoPath('vs/editor/editor.main'),
  resolveMonacoPath('vs/editor/editor.api')
];
const WORKER_LOADER_PATH = resolveMonacoPath('vs/editor/common/services/editorSimpleWorker');
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
    [id, ...(language.alias || [])].map((label) => [label, { label, ...language }])
  )
);
const featuresById = mapValues(FEATURES, (feature, key) => ({ label: key, ...feature }))

class MonacoWebpackPlugin {
  constructor(options = {}) {
    const languages = options.languages || Object.keys(languagesById);
    const features = options.features || Object.keys(featuresById);
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
    const modules = [EDITOR_MODULE, ...languages, ...features];
    const workers = modules.map(
      ({ label, alias, worker }) => worker && ({ label, alias, ...worker })
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
  const existingRules = moduleOptions.rules || (moduleOptions.rules = []);
  existingRules.push(...rules);
}

function addCompilerPlugins(compiler, plugins) {
  plugins.forEach((plugin) => plugin.apply(compiler));
}

function getPublicPath(compiler) {
  return compiler.options.output && compiler.options.output.publicPath || '';
}

function createLoaderRules(languages, features, workers, outputPath, publicPath) {
  if (!languages.length && !features.length) { return []; }
  const languagePaths = languages.map(({ entry }) => entry).filter(Boolean);
  const featurePaths = features.map(({ entry }) => entry).filter(Boolean);
  const workerPaths = fromPairs(workers.map(({ label, output }) => [label, path.join(outputPath, output)]));

  const globals = {
    'MonacoEnvironment': `(function (paths) {
      function stripTrailingSlash(str) {
        return str.replace(/\\/$/, '');
      }
      return {
        getWorkerUrl: function (moduleId, label) {
          const pathPrefix = (typeof window.__webpack_public_path__ === 'string' ? window.__webpack_public_path__ : ${JSON.stringify(publicPath)});
          return (pathPrefix ? stripTrailingSlash(pathPrefix) + '/' : '') + paths[label];
        }
      };
    })(${JSON.stringify(workerPaths, null, 2)})`,
  };

  return [
    {
      test: MONACO_EDITOR_API_PATHS,
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
  const workerFallbacks = workers.reduce((acc, { id, fallback }) => (fallback ? Object.assign(acc, {
    [id]: resolveMonacoPath(fallback)
  }) : acc), {});
  return [
    ...Object.keys(IGNORED_IMPORTS).map((id) =>
      createIgnoreImportsPlugin(id, IGNORED_IMPORTS[id])
    ),
    ...uniqBy(workers, ({ id }) => id).map(({ id, entry, output }) =>
      new AddWorkerEntryPointPlugin({
        id,
        entry: resolveMonacoPath(entry),
        filename: path.join(outputPath, output),
        plugins: [
          createContextPlugin(WORKER_LOADER_PATH, {}),
          new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
        ],
      })
    ),
    ...(workerFallbacks ? [createContextPlugin(WORKER_LOADER_PATH, workerFallbacks)] : []),
  ];
}

function createContextPlugin(filePath, contextPaths) {
  return new webpack.ContextReplacementPlugin(
    new RegExp(`^${path.dirname(filePath)}$`),
    '',
    contextPaths
  );
}

function createIgnoreImportsPlugin(targetPath, ignoredModules) {
  return new webpack.IgnorePlugin(
    new RegExp(`^(${ignoredModules.map((id) => `(${id})`).join('|')})$`),
    new RegExp(`^${path.dirname(targetPath)}$`)
  );
}

function flatMap(items, iteratee) {
  return items.map(iteratee).reduce((acc, item) => [...acc, ...item], []);
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

module.exports = MonacoWebpackPlugin;
