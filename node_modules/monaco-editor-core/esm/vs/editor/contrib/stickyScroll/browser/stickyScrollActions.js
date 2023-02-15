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
import { localize } from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
export class ToggleStickyScroll extends Action2 {
    constructor() {
        super({
            id: 'editor.action.toggleStickyScroll',
            title: {
                value: localize('toggleStickyScroll', "Toggle Sticky Scroll"),
                mnemonicTitle: localize({ key: 'mitoggleStickyScroll', comment: ['&& denotes a mnemonic'] }, "&&Toggle Sticky Scroll"),
                original: 'Toggle Sticky Scroll',
            },
            category: Categories.View,
            toggled: {
                condition: ContextKeyExpr.equals('config.editor.stickyScroll.enabled', true),
                title: localize('stickyScroll', "Sticky Scroll"),
                mnemonicTitle: localize({ key: 'miStickyScroll', comment: ['&& denotes a mnemonic'] }, "&&Sticky Scroll"),
            },
            menu: [
                { id: MenuId.CommandPalette },
                { id: MenuId.MenubarViewMenu, group: '5_editor', order: 2 },
                { id: MenuId.StickyScrollContext }
            ]
        });
    }
    run(accessor) {
        return __awaiter(this, void 0, void 0, function* () {
            const configurationService = accessor.get(IConfigurationService);
            const newValue = !configurationService.getValue('editor.stickyScroll.enabled');
            return configurationService.updateValue('editor.stickyScroll.enabled', newValue);
        });
    }
}
