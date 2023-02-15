/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../nls.js';
import { Emitter } from '../../../base/common/event.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { Mimes } from '../../../base/common/mime.js';
import { Extensions as ConfigurationExtensions } from '../../../platform/configuration/common/configurationRegistry.js';
// Define extension point ids
export const Extensions = {
    ModesRegistry: 'editor.modesRegistry'
};
export class EditorModesRegistry {
    constructor() {
        this._onDidChangeLanguages = new Emitter();
        this.onDidChangeLanguages = this._onDidChangeLanguages.event;
        this._languages = [];
    }
    registerLanguage(def) {
        this._languages.push(def);
        this._onDidChangeLanguages.fire(undefined);
        return {
            dispose: () => {
                for (let i = 0, len = this._languages.length; i < len; i++) {
                    if (this._languages[i] === def) {
                        this._languages.splice(i, 1);
                        return;
                    }
                }
            }
        };
    }
    getLanguages() {
        return this._languages;
    }
}
export const ModesRegistry = new EditorModesRegistry();
Registry.add(Extensions.ModesRegistry, ModesRegistry);
export const PLAINTEXT_LANGUAGE_ID = 'plaintext';
export const PLAINTEXT_EXTENSION = '.txt';
ModesRegistry.registerLanguage({
    id: PLAINTEXT_LANGUAGE_ID,
    extensions: [PLAINTEXT_EXTENSION],
    aliases: [nls.localize('plainText.alias', "Plain Text"), 'text'],
    mimetypes: [Mimes.text]
});
Registry.as(ConfigurationExtensions.Configuration)
    .registerDefaultConfigurations([{
        overrides: {
            '[plaintext]': {
                'editor.unicodeHighlight.ambiguousCharacters': false,
                'editor.unicodeHighlight.invisibleCharacters': false
            }
        }
    }]);
