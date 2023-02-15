/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { Emitter } from '../../../base/common/event.js';
import { KeyChord } from '../../../base/common/keyCodes.js';
import { URI } from '../../../base/common/uri.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { Selection } from '../core/selection.js';
import { Token } from '../languages.js';
import * as standaloneEnums from '../standalone/standaloneEnums.js';
class KeyMod {
    static chord(firstPart, secondPart) {
        return KeyChord(firstPart, secondPart);
    }
}
KeyMod.CtrlCmd = 2048 /* ConstKeyMod.CtrlCmd */;
KeyMod.Shift = 1024 /* ConstKeyMod.Shift */;
KeyMod.Alt = 512 /* ConstKeyMod.Alt */;
KeyMod.WinCtrl = 256 /* ConstKeyMod.WinCtrl */;
export { KeyMod };
export function createMonacoBaseAPI() {
    return {
        editor: undefined,
        languages: undefined,
        CancellationTokenSource: CancellationTokenSource,
        Emitter: Emitter,
        KeyCode: standaloneEnums.KeyCode,
        KeyMod: KeyMod,
        Position: Position,
        Range: Range,
        Selection: Selection,
        SelectionDirection: standaloneEnums.SelectionDirection,
        MarkerSeverity: standaloneEnums.MarkerSeverity,
        MarkerTag: standaloneEnums.MarkerTag,
        Uri: URI,
        Token: Token
    };
}
