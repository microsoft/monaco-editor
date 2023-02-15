/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IntervalTimer, TimeoutTimer } from '../../../base/common/async.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import * as nls from '../../../nls.js';
import { IME } from '../../../base/common/ime.js';
const HIGH_FREQ_COMMANDS = /^(cursor|delete|undo|redo|tab|editor\.action\.clipboard)/;
export class AbstractKeybindingService extends Disposable {
    get onDidUpdateKeybindings() {
        return this._onDidUpdateKeybindings ? this._onDidUpdateKeybindings.event : Event.None; // Sinon stubbing walks properties on prototype
    }
    constructor(_contextKeyService, _commandService, _telemetryService, _notificationService, _logService) {
        super();
        this._contextKeyService = _contextKeyService;
        this._commandService = _commandService;
        this._telemetryService = _telemetryService;
        this._notificationService = _notificationService;
        this._logService = _logService;
        this._onDidUpdateKeybindings = this._register(new Emitter());
        this._currentChord = null;
        this._currentChordChecker = new IntervalTimer();
        this._currentChordStatusMessage = null;
        this._ignoreSingleModifiers = KeybindingModifierSet.EMPTY;
        this._currentSingleModifier = null;
        this._currentSingleModifierClearTimeout = new TimeoutTimer();
        this._logging = false;
    }
    dispose() {
        super.dispose();
    }
    _log(str) {
        if (this._logging) {
            this._logService.info(`[KeybindingService]: ${str}`);
        }
    }
    getKeybindings() {
        return this._getResolver().getKeybindings();
    }
    lookupKeybinding(commandId, context) {
        const result = this._getResolver().lookupPrimaryKeybinding(commandId, context || this._contextKeyService);
        if (!result) {
            return undefined;
        }
        return result.resolvedKeybinding;
    }
    dispatchEvent(e, target) {
        return this._dispatch(e, target);
    }
    softDispatch(e, target) {
        this._log(`/ Soft dispatching keyboard event`);
        const keybinding = this.resolveKeyboardEvent(e);
        if (keybinding.hasMultipleChords()) {
            console.warn('Unexpected keyboard event mapped to multiple chords');
            return null;
        }
        const [firstChord,] = keybinding.getDispatchChords();
        if (firstChord === null) {
            // cannot be dispatched, probably only modifier keys
            this._log(`\\ Keyboard event cannot be dispatched`);
            return null;
        }
        const contextValue = this._contextKeyService.getContext(target);
        const currentChord = this._currentChord ? this._currentChord.keypress : null;
        return this._getResolver().resolve(contextValue, currentChord, firstChord);
    }
    _enterMultiChordMode(firstChord, keypressLabel) {
        this._currentChord = {
            keypress: firstChord,
            label: keypressLabel
        };
        this._currentChordStatusMessage = this._notificationService.status(nls.localize('first.chord', "({0}) was pressed. Waiting for second key of chord...", keypressLabel));
        const chordEnterTime = Date.now();
        this._currentChordChecker.cancelAndSet(() => {
            if (!this._documentHasFocus()) {
                // Focus has been lost => leave chord mode
                this._leaveChordMode();
                return;
            }
            if (Date.now() - chordEnterTime > 5000) {
                // 5 seconds elapsed => leave chord mode
                this._leaveChordMode();
            }
        }, 500);
        IME.disable();
    }
    _leaveChordMode() {
        if (this._currentChordStatusMessage) {
            this._currentChordStatusMessage.dispose();
            this._currentChordStatusMessage = null;
        }
        this._currentChordChecker.cancel();
        this._currentChord = null;
        IME.enable();
    }
    _dispatch(e, target) {
        return this._doDispatch(this.resolveKeyboardEvent(e), target, /*isSingleModiferChord*/ false);
    }
    _singleModifierDispatch(e, target) {
        const keybinding = this.resolveKeyboardEvent(e);
        const [singleModifier,] = keybinding.getSingleModifierDispatchChords();
        if (singleModifier) {
            if (this._ignoreSingleModifiers.has(singleModifier)) {
                this._log(`+ Ignoring single modifier ${singleModifier} due to it being pressed together with other keys.`);
                this._ignoreSingleModifiers = KeybindingModifierSet.EMPTY;
                this._currentSingleModifierClearTimeout.cancel();
                this._currentSingleModifier = null;
                return false;
            }
            this._ignoreSingleModifiers = KeybindingModifierSet.EMPTY;
            if (this._currentSingleModifier === null) {
                // we have a valid `singleModifier`, store it for the next keyup, but clear it in 300ms
                this._log(`+ Storing single modifier for possible chord ${singleModifier}.`);
                this._currentSingleModifier = singleModifier;
                this._currentSingleModifierClearTimeout.cancelAndSet(() => {
                    this._log(`+ Clearing single modifier due to 300ms elapsed.`);
                    this._currentSingleModifier = null;
                }, 300);
                return false;
            }
            if (singleModifier === this._currentSingleModifier) {
                // bingo!
                this._log(`/ Dispatching single modifier chord ${singleModifier} ${singleModifier}`);
                this._currentSingleModifierClearTimeout.cancel();
                this._currentSingleModifier = null;
                return this._doDispatch(keybinding, target, /*isSingleModiferChord*/ true);
            }
            this._log(`+ Clearing single modifier due to modifier mismatch: ${this._currentSingleModifier} ${singleModifier}`);
            this._currentSingleModifierClearTimeout.cancel();
            this._currentSingleModifier = null;
            return false;
        }
        // When pressing a modifier and holding it pressed with any other modifier or key combination,
        // the pressed modifiers should no longer be considered for single modifier dispatch.
        const [firstChord,] = keybinding.getChords();
        this._ignoreSingleModifiers = new KeybindingModifierSet(firstChord);
        if (this._currentSingleModifier !== null) {
            this._log(`+ Clearing single modifier due to other key up.`);
        }
        this._currentSingleModifierClearTimeout.cancel();
        this._currentSingleModifier = null;
        return false;
    }
    _doDispatch(keybinding, target, isSingleModiferChord = false) {
        let shouldPreventDefault = false;
        if (keybinding.hasMultipleChords()) {
            console.warn('Unexpected keyboard event mapped to multiple chords');
            return false;
        }
        let firstChord = null; // the first keybinding i.e. Ctrl+K
        let currentChord = null; // the "second" keybinding i.e. Ctrl+K "Ctrl+D"
        if (isSingleModiferChord) {
            const [dispatchKeyname,] = keybinding.getSingleModifierDispatchChords();
            firstChord = dispatchKeyname;
            currentChord = dispatchKeyname;
        }
        else {
            [firstChord,] = keybinding.getDispatchChords();
            currentChord = this._currentChord ? this._currentChord.keypress : null;
        }
        if (firstChord === null) {
            this._log(`\\ Keyboard event cannot be dispatched in keydown phase.`);
            // cannot be dispatched, probably only modifier keys
            return shouldPreventDefault;
        }
        const contextValue = this._contextKeyService.getContext(target);
        const keypressLabel = keybinding.getLabel();
        const resolveResult = this._getResolver().resolve(contextValue, currentChord, firstChord);
        this._logService.trace('KeybindingService#dispatch', keypressLabel, resolveResult === null || resolveResult === void 0 ? void 0 : resolveResult.commandId);
        if (resolveResult && resolveResult.enterMultiChord) {
            shouldPreventDefault = true;
            this._enterMultiChordMode(firstChord, keypressLabel);
            this._log(`+ Entering chord mode...`);
            return shouldPreventDefault;
        }
        if (this._currentChord) {
            if (!resolveResult || !resolveResult.commandId) {
                this._log(`+ Leaving chord mode: Nothing bound to "${this._currentChord.label} ${keypressLabel}".`);
                this._notificationService.status(nls.localize('missing.chord', "The key combination ({0}, {1}) is not a command.", this._currentChord.label, keypressLabel), { hideAfter: 10 * 1000 /* 10s */ });
                shouldPreventDefault = true;
            }
        }
        this._leaveChordMode();
        if (resolveResult && resolveResult.commandId) {
            if (!resolveResult.bubble) {
                shouldPreventDefault = true;
            }
            this._log(`+ Invoking command ${resolveResult.commandId}.`);
            if (typeof resolveResult.commandArgs === 'undefined') {
                this._commandService.executeCommand(resolveResult.commandId).then(undefined, err => this._notificationService.warn(err));
            }
            else {
                this._commandService.executeCommand(resolveResult.commandId, resolveResult.commandArgs).then(undefined, err => this._notificationService.warn(err));
            }
            if (!HIGH_FREQ_COMMANDS.test(resolveResult.commandId)) {
                this._telemetryService.publicLog2('workbenchActionExecuted', { id: resolveResult.commandId, from: 'keybinding' });
            }
        }
        return shouldPreventDefault;
    }
    mightProducePrintableCharacter(event) {
        if (event.ctrlKey || event.metaKey) {
            // ignore ctrl/cmd-combination but not shift/alt-combinatios
            return false;
        }
        // weak check for certain ranges. this is properly implemented in a subclass
        // with access to the KeyboardMapperFactory.
        if ((event.keyCode >= 31 /* KeyCode.KeyA */ && event.keyCode <= 56 /* KeyCode.KeyZ */)
            || (event.keyCode >= 21 /* KeyCode.Digit0 */ && event.keyCode <= 30 /* KeyCode.Digit9 */)) {
            return true;
        }
        return false;
    }
}
class KeybindingModifierSet {
    constructor(source) {
        this._ctrlKey = source ? source.ctrlKey : false;
        this._shiftKey = source ? source.shiftKey : false;
        this._altKey = source ? source.altKey : false;
        this._metaKey = source ? source.metaKey : false;
    }
    has(modifier) {
        switch (modifier) {
            case 'ctrl': return this._ctrlKey;
            case 'shift': return this._shiftKey;
            case 'alt': return this._altKey;
            case 'meta': return this._metaKey;
        }
    }
}
KeybindingModifierSet.EMPTY = new KeybindingModifierSet(null);
