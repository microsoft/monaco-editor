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
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { assertType } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { ITextModelService } from '../../../common/services/resolverService.js';
import { IOutlineModelService } from './outlineModel.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
CommandsRegistry.registerCommand('_executeDocumentSymbolProvider', function (accessor, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const [resource] = args;
        assertType(URI.isUri(resource));
        const outlineService = accessor.get(IOutlineModelService);
        const modelService = accessor.get(ITextModelService);
        const reference = yield modelService.createModelReference(resource);
        try {
            return (yield outlineService.getOrCreate(reference.object.textEditorModel, CancellationToken.None)).getTopLevelSymbols();
        }
        finally {
            reference.dispose();
        }
    });
});
