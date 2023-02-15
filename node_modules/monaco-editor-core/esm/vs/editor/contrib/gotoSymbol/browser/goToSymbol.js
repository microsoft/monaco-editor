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
import { coalesce } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { registerModelAndPositionCommand } from '../../../browser/editorExtensions.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { ReferencesModel } from './referencesModel.js';
function getLocationLinks(model, position, registry, provide) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = registry.ordered(model);
        // get results
        const promises = provider.map((provider) => {
            return Promise.resolve(provide(provider, model, position)).then(undefined, err => {
                onUnexpectedExternalError(err);
                return undefined;
            });
        });
        const values = yield Promise.all(promises);
        return coalesce(values.flat());
    });
}
export function getDefinitionsAtPosition(registry, model, position, token) {
    return getLocationLinks(model, position, registry, (provider, model, position) => {
        return provider.provideDefinition(model, position, token);
    });
}
export function getDeclarationsAtPosition(registry, model, position, token) {
    return getLocationLinks(model, position, registry, (provider, model, position) => {
        return provider.provideDeclaration(model, position, token);
    });
}
export function getImplementationsAtPosition(registry, model, position, token) {
    return getLocationLinks(model, position, registry, (provider, model, position) => {
        return provider.provideImplementation(model, position, token);
    });
}
export function getTypeDefinitionsAtPosition(registry, model, position, token) {
    return getLocationLinks(model, position, registry, (provider, model, position) => {
        return provider.provideTypeDefinition(model, position, token);
    });
}
export function getReferencesAtPosition(registry, model, position, compact, token) {
    return getLocationLinks(model, position, registry, (provider, model, position) => __awaiter(this, void 0, void 0, function* () {
        const result = yield provider.provideReferences(model, position, { includeDeclaration: true }, token);
        if (!compact || !result || result.length !== 2) {
            return result;
        }
        const resultWithoutDeclaration = yield provider.provideReferences(model, position, { includeDeclaration: false }, token);
        if (resultWithoutDeclaration && resultWithoutDeclaration.length === 1) {
            return resultWithoutDeclaration;
        }
        return result;
    }));
}
// -- API commands ----
function _sortedAndDeduped(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const rawLinks = yield callback();
        const model = new ReferencesModel(rawLinks, '');
        const modelLinks = model.references.map(ref => ref.link);
        model.dispose();
        return modelLinks;
    });
}
registerModelAndPositionCommand('_executeDefinitionProvider', (accessor, model, position) => {
    const languageFeaturesService = accessor.get(ILanguageFeaturesService);
    const promise = getDefinitionsAtPosition(languageFeaturesService.definitionProvider, model, position, CancellationToken.None);
    return _sortedAndDeduped(() => promise);
});
registerModelAndPositionCommand('_executeTypeDefinitionProvider', (accessor, model, position) => {
    const languageFeaturesService = accessor.get(ILanguageFeaturesService);
    const promise = getTypeDefinitionsAtPosition(languageFeaturesService.typeDefinitionProvider, model, position, CancellationToken.None);
    return _sortedAndDeduped(() => promise);
});
registerModelAndPositionCommand('_executeDeclarationProvider', (accessor, model, position) => {
    const languageFeaturesService = accessor.get(ILanguageFeaturesService);
    const promise = getDeclarationsAtPosition(languageFeaturesService.declarationProvider, model, position, CancellationToken.None);
    return _sortedAndDeduped(() => promise);
});
registerModelAndPositionCommand('_executeReferenceProvider', (accessor, model, position) => {
    const languageFeaturesService = accessor.get(ILanguageFeaturesService);
    const promise = getReferencesAtPosition(languageFeaturesService.referenceProvider, model, position, false, CancellationToken.None);
    return _sortedAndDeduped(() => promise);
});
registerModelAndPositionCommand('_executeImplementationProvider', (accessor, model, position) => {
    const languageFeaturesService = accessor.get(ILanguageFeaturesService);
    const promise = getImplementationsAtPosition(languageFeaturesService.implementationProvider, model, position, CancellationToken.None);
    return _sortedAndDeduped(() => promise);
});
