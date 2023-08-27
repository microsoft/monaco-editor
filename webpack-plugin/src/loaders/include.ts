import type { PitchLoaderDefinitionFunction } from 'webpack';
import * as loaderUtils from 'loader-utils';
import type * as MonacoEditorWebpackPlugin from '../index';

export interface ILoaderOptions {
	pluginInstance: MonacoEditorWebpackPlugin;
	publicPath: string;
	globalAPI: boolean;
	pre?: string[];
	post?: string[];
}

export const pitch: PitchLoaderDefinitionFunction<ILoaderOptions> = function pitch(
	remainingRequest
) {
	const {
		pluginInstance,
		publicPath,
		globalAPI,
		pre = [],
		post = []
	} = (this.query as ILoaderOptions) || {};

	this.cacheable(false);
	const callback = this.async();

	// HACK: NamedModulesPlugin overwrites existing modules when requesting the same module via
	// different loaders, so we need to circumvent this by appending a suffix to make the name unique
	// See https://github.com/webpack/webpack/issues/4613#issuecomment-325178346 for details
	if (this._module && this._module.userRequest) {
		this._module.userRequest = `include-loader!${this._module.userRequest}`;
	}

	const stringifyRequest = (request: string) => {
		if (this.utils) {
			return JSON.stringify(this.utils.contextify(this.context || this.rootContext, request));
		}
		return loaderUtils.stringifyRequest(this, request);
	};

	const getContent = () => {
		const globals: Record<string, string> = {
			MonacoEnvironment: `(function (paths) {
      function stripTrailingSlash(str) {
        return str.replace(/\\/$/, '');
      }
      return {
        globalAPI: ${globalAPI},
        getWorkerUrl: function (moduleId, label) {
          var pathPrefix = ${publicPath};
          var result = (pathPrefix ? stripTrailingSlash(pathPrefix) + '/' : '') + paths[label];
          if (/^((http:)|(https:)|(file:)|(\\/\\/))/.test(result)) {
            var currentUrl = String(window.location);
            var currentOrigin = currentUrl.substr(0, currentUrl.length - window.location.hash.length - window.location.search.length - window.location.pathname.length);
            if (result.substring(0, currentOrigin.length) !== currentOrigin) {
              if(/^(\\/\\/)/.test(result)) {
                result = window.location.protocol + result
              }
              var js = '/*' + label + '*/importScripts("' + result + '");';
              var blob = new Blob([js], { type: 'application/javascript' });
              return URL.createObjectURL(blob);
            }
          }
          return result;
        }
      };
    })(${JSON.stringify(pluginInstance.workerPathsMap, null, 2)})`
		};

		return [
			...(globals
				? Object.keys(globals).map((key) => `self[${JSON.stringify(key)}] = ${globals[key]};`)
				: []),
			...pre.map((include: any) => `import ${stringifyRequest(include)};`),
			`
import * as monaco from ${stringifyRequest(`!!${remainingRequest}`)};
export * from ${stringifyRequest(`!!${remainingRequest}`)};
export default monaco;
		`,
			...post.map((include: any) => `import ${stringifyRequest(include)};`)
		].join('\n');
	};

	pluginInstance.workersTask.then(
		() => {
			callback(null, getContent());
		},
		(err) => {
			callback(err, getContent());
		}
	);
};
