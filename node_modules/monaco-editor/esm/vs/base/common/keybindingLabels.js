/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../nls.js';
export class ModifierLabelProvider {
    constructor(mac, windows, linux = windows) {
        this.modifierLabels = [null]; // index 0 will never me accessed.
        this.modifierLabels[2 /* OperatingSystem.Macintosh */] = mac;
        this.modifierLabels[1 /* OperatingSystem.Windows */] = windows;
        this.modifierLabels[3 /* OperatingSystem.Linux */] = linux;
    }
    toLabel(OS, chords, keyLabelProvider) {
        if (chords.length === 0) {
            return null;
        }
        const result = [];
        for (let i = 0, len = chords.length; i < len; i++) {
            const chord = chords[i];
            const keyLabel = keyLabelProvider(chord);
            if (keyLabel === null) {
                // this keybinding cannot be expressed...
                return null;
            }
            result[i] = _simpleAsString(chord, keyLabel, this.modifierLabels[OS]);
        }
        return result.join(' ');
    }
}
/**
 * A label provider that prints modifiers in a suitable format for displaying in the UI.
 */
export const UILabelProvider = new ModifierLabelProvider({
    ctrlKey: '\u2303',
    shiftKey: '⇧',
    altKey: '⌥',
    metaKey: '⌘',
    separator: '',
}, {
    ctrlKey: nls.localize({ key: 'ctrlKey', comment: ['This is the short form for the Control key on the keyboard'] }, "Ctrl"),
    shiftKey: nls.localize({ key: 'shiftKey', comment: ['This is the short form for the Shift key on the keyboard'] }, "Shift"),
    altKey: nls.localize({ key: 'altKey', comment: ['This is the short form for the Alt key on the keyboard'] }, "Alt"),
    metaKey: nls.localize({ key: 'windowsKey', comment: ['This is the short form for the Windows key on the keyboard'] }, "Windows"),
    separator: '+',
}, {
    ctrlKey: nls.localize({ key: 'ctrlKey', comment: ['This is the short form for the Control key on the keyboard'] }, "Ctrl"),
    shiftKey: nls.localize({ key: 'shiftKey', comment: ['This is the short form for the Shift key on the keyboard'] }, "Shift"),
    altKey: nls.localize({ key: 'altKey', comment: ['This is the short form for the Alt key on the keyboard'] }, "Alt"),
    metaKey: nls.localize({ key: 'superKey', comment: ['This is the short form for the Super key on the keyboard'] }, "Super"),
    separator: '+',
});
/**
 * A label provider that prints modifiers in a suitable format for ARIA.
 */
export const AriaLabelProvider = new ModifierLabelProvider({
    ctrlKey: nls.localize({ key: 'ctrlKey.long', comment: ['This is the long form for the Control key on the keyboard'] }, "Control"),
    shiftKey: nls.localize({ key: 'shiftKey.long', comment: ['This is the long form for the Shift key on the keyboard'] }, "Shift"),
    altKey: nls.localize({ key: 'optKey.long', comment: ['This is the long form for the Alt/Option key on the keyboard'] }, "Option"),
    metaKey: nls.localize({ key: 'cmdKey.long', comment: ['This is the long form for the Command key on the keyboard'] }, "Command"),
    separator: '+',
}, {
    ctrlKey: nls.localize({ key: 'ctrlKey.long', comment: ['This is the long form for the Control key on the keyboard'] }, "Control"),
    shiftKey: nls.localize({ key: 'shiftKey.long', comment: ['This is the long form for the Shift key on the keyboard'] }, "Shift"),
    altKey: nls.localize({ key: 'altKey.long', comment: ['This is the long form for the Alt key on the keyboard'] }, "Alt"),
    metaKey: nls.localize({ key: 'windowsKey.long', comment: ['This is the long form for the Windows key on the keyboard'] }, "Windows"),
    separator: '+',
}, {
    ctrlKey: nls.localize({ key: 'ctrlKey.long', comment: ['This is the long form for the Control key on the keyboard'] }, "Control"),
    shiftKey: nls.localize({ key: 'shiftKey.long', comment: ['This is the long form for the Shift key on the keyboard'] }, "Shift"),
    altKey: nls.localize({ key: 'altKey.long', comment: ['This is the long form for the Alt key on the keyboard'] }, "Alt"),
    metaKey: nls.localize({ key: 'superKey.long', comment: ['This is the long form for the Super key on the keyboard'] }, "Super"),
    separator: '+',
});
/**
 * A label provider that prints modifiers in a suitable format for Electron Accelerators.
 * See https://github.com/electron/electron/blob/master/docs/api/accelerator.md
 */
export const ElectronAcceleratorLabelProvider = new ModifierLabelProvider({
    ctrlKey: 'Ctrl',
    shiftKey: 'Shift',
    altKey: 'Alt',
    metaKey: 'Cmd',
    separator: '+',
}, {
    ctrlKey: 'Ctrl',
    shiftKey: 'Shift',
    altKey: 'Alt',
    metaKey: 'Super',
    separator: '+',
});
/**
 * A label provider that prints modifiers in a suitable format for user settings.
 */
export const UserSettingsLabelProvider = new ModifierLabelProvider({
    ctrlKey: 'ctrl',
    shiftKey: 'shift',
    altKey: 'alt',
    metaKey: 'cmd',
    separator: '+',
}, {
    ctrlKey: 'ctrl',
    shiftKey: 'shift',
    altKey: 'alt',
    metaKey: 'win',
    separator: '+',
}, {
    ctrlKey: 'ctrl',
    shiftKey: 'shift',
    altKey: 'alt',
    metaKey: 'meta',
    separator: '+',
});
function _simpleAsString(modifiers, key, labels) {
    if (key === null) {
        return '';
    }
    const result = [];
    // translate modifier keys: Ctrl-Shift-Alt-Meta
    if (modifiers.ctrlKey) {
        result.push(labels.ctrlKey);
    }
    if (modifiers.shiftKey) {
        result.push(labels.shiftKey);
    }
    if (modifiers.altKey) {
        result.push(labels.altKey);
    }
    if (modifiers.metaKey) {
        result.push(labels.metaKey);
    }
    // the actual key
    if (key !== '') {
        result.push(key);
    }
    return result.join(labels.separator);
}
