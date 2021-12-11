import type { PitchLoaderDefinitionFunction } from 'webpack';
import * as loaderUtils from 'loader-utils';

export interface ILoaderOptions {
	globals?: { [key: string]: string };
	pre?: string[];
	post?: string[];
}

export const pitch: PitchLoaderDefinitionFunction<ILoaderOptions> = function pitch(
	remainingRequest
) {
	const { globals = undefined, pre = [], post = [] } = (this.query as ILoaderOptions) || {};

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

	return [
		...(globals
			? Object.keys(globals).map((key) => `self[${JSON.stringify(key)}] = ${globals[key]};`)
			: []),
		...pre.map((include: any) => `require(${stringifyRequest(include)});`),
		`module.exports = require(${stringifyRequest(`!!${remainingRequest}`)});`,
		...post.map((include: any) => `require(${stringifyRequest(include)});`)
	].join('\n');
};
