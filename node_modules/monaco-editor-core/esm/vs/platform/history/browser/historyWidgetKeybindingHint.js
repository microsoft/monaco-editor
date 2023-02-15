/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export function showHistoryKeybindingHint(keybindingService) {
    var _a, _b;
    return ((_a = keybindingService.lookupKeybinding('history.showPrevious')) === null || _a === void 0 ? void 0 : _a.getElectronAccelerator()) === 'Up' && ((_b = keybindingService.lookupKeybinding('history.showNext')) === null || _b === void 0 ? void 0 : _b.getElectronAccelerator()) === 'Down';
}
