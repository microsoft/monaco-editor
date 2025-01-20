/* This fix ensures that old nls-plugin configurations are still respected by the new localization solution. */
/* We should try to avoid this file and find a different solution.  */
/* Warning: This file still has to work when replacing "\n" with " "! */

/**
 * @type {typeof define}
 */
const globalDefine = globalThis.define;
globalDefine('vs/nls.messages-loader', [], function (...args) {
	return {
		load: (name, req, load, config) => {
			const requestedLanguage = config['vs/nls']?.availableLanguages?.['*'];
			if (!requestedLanguage || requestedLanguage === 'en') {
				load({});
			} else {
				req([`vs/nls.messages.${requestedLanguage}`], () => {
					load({});
				});
			}
		}
	};
});
globalDefine(
	'vs/nls.messages',
	['require', 'exports', 'vs/nls.messages-loader!'],
	function (require, exports) {
		Object.assign(exports, {
			getNLSMessages: () => globalThis._VSCODE_NLS_MESSAGES,
			getNLSLanguage: () => globalThis._VSCODE_NLS_LANGUAGE
		});
	}
);
define = function (...args) {
	if (args.length > 0 && args[0] === 'vs/nls.messages') {
		return;
	}
	return globalDefine(...args);
};
define.amd = true;
