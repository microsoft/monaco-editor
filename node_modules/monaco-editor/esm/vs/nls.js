/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let isPseudo = (typeof document !== 'undefined' && document.location && document.location.hash.indexOf('pseudo=true') >= 0);
const DEFAULT_TAG = 'i-default';
function _format(message, args) {
    let result;
    if (args.length === 0) {
        result = message;
    }
    else {
        result = message.replace(/\{(\d+)\}/g, (match, rest) => {
            const index = rest[0];
            const arg = args[index];
            let result = match;
            if (typeof arg === 'string') {
                result = arg;
            }
            else if (typeof arg === 'number' || typeof arg === 'boolean' || arg === void 0 || arg === null) {
                result = String(arg);
            }
            return result;
        });
    }
    if (isPseudo) {
        // FF3B and FF3D is the Unicode zenkaku representation for [ and ]
        result = '\uFF3B' + result.replace(/[aouei]/g, '$&$&') + '\uFF3D';
    }
    return result;
}
function findLanguageForModule(config, name) {
    let result = config[name];
    if (result) {
        return result;
    }
    result = config['*'];
    if (result) {
        return result;
    }
    return null;
}
function endWithSlash(path) {
    if (path.charAt(path.length - 1) === '/') {
        return path;
    }
    return path + '/';
}
function getMessagesFromTranslationsService(translationServiceUrl, language, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = endWithSlash(translationServiceUrl) + endWithSlash(language) + 'vscode/' + endWithSlash(name);
        const res = yield fetch(url);
        if (res.ok) {
            const messages = yield res.json();
            return messages;
        }
        throw new Error(`${res.status} - ${res.statusText}`);
    });
}
function createScopedLocalize(scope) {
    return function (idx, defaultValue) {
        const restArgs = Array.prototype.slice.call(arguments, 2);
        return _format(scope[idx], restArgs);
    };
}
export function localize(data, message, ...args) {
    return _format(message, args);
}
export function getConfiguredDefaultLocale(_) {
    // This returns undefined because this implementation isn't used and is overwritten by the loader
    // when loaded.
    return undefined;
}
export function setPseudoTranslation(value) {
    isPseudo = value;
}
/**
 * Invoked in a built product at run-time
 */
export function create(key, data) {
    var _a;
    return {
        localize: createScopedLocalize(data[key]),
        getConfiguredDefaultLocale: (_a = data.getConfiguredDefaultLocale) !== null && _a !== void 0 ? _a : ((_) => undefined)
    };
}
/**
 * Invoked by the loader at run-time
 */
export function load(name, req, load, config) {
    var _a;
    const pluginConfig = (_a = config['vs/nls']) !== null && _a !== void 0 ? _a : {};
    if (!name || name.length === 0) {
        return load({
            localize: localize,
            getConfiguredDefaultLocale: () => { var _a; return (_a = pluginConfig.availableLanguages) === null || _a === void 0 ? void 0 : _a['*']; }
        });
    }
    const language = pluginConfig.availableLanguages ? findLanguageForModule(pluginConfig.availableLanguages, name) : null;
    const useDefaultLanguage = language === null || language === DEFAULT_TAG;
    let suffix = '.nls';
    if (!useDefaultLanguage) {
        suffix = suffix + '.' + language;
    }
    const messagesLoaded = (messages) => {
        if (Array.isArray(messages)) {
            messages.localize = createScopedLocalize(messages);
        }
        else {
            messages.localize = createScopedLocalize(messages[name]);
        }
        messages.getConfiguredDefaultLocale = () => { var _a; return (_a = pluginConfig.availableLanguages) === null || _a === void 0 ? void 0 : _a['*']; };
        load(messages);
    };
    if (typeof pluginConfig.loadBundle === 'function') {
        pluginConfig.loadBundle(name, language, (err, messages) => {
            // We have an error. Load the English default strings to not fail
            if (err) {
                req([name + '.nls'], messagesLoaded);
            }
            else {
                messagesLoaded(messages);
            }
        });
    }
    else if (pluginConfig.translationServiceUrl && !useDefaultLanguage) {
        (() => __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                const messages = yield getMessagesFromTranslationsService(pluginConfig.translationServiceUrl, language, name);
                return messagesLoaded(messages);
            }
            catch (err) {
                // Language is already as generic as it gets, so require default messages
                if (!language.includes('-')) {
                    console.error(err);
                    return req([name + '.nls'], messagesLoaded);
                }
                try {
                    // Since there is a dash, the language configured is a specific sub-language of the same generic language.
                    // Since we were unable to load the specific language, try to load the generic language. Ex. we failed to find a
                    // Swiss German (de-CH), so try to load the generic German (de) messages instead.
                    const genericLanguage = language.split('-')[0];
                    const messages = yield getMessagesFromTranslationsService(pluginConfig.translationServiceUrl, genericLanguage, name);
                    // We got some messages, so we configure the configuration to use the generic language for this session.
                    (_b = pluginConfig.availableLanguages) !== null && _b !== void 0 ? _b : (pluginConfig.availableLanguages = {});
                    pluginConfig.availableLanguages['*'] = genericLanguage;
                    return messagesLoaded(messages);
                }
                catch (err) {
                    console.error(err);
                    return req([name + '.nls'], messagesLoaded);
                }
            }
        }))();
    }
    else {
        req([name + suffix], messagesLoaded, (err) => {
            if (suffix === '.nls') {
                console.error('Failed trying to load default language strings', err);
                return;
            }
            console.error(`Failed to load message bundle for language ${language}. Falling back to the default language:`, err);
            req([name + '.nls'], messagesLoaded);
        });
    }
}
