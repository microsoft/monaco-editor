/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { implies, expressionsAreEqualWithConstantSubstitution } from '../../contextkey/common/contextkey.js';
export class KeybindingResolver {
    constructor(defaultKeybindings, overrides, log) {
        this._log = log;
        this._defaultKeybindings = defaultKeybindings;
        this._defaultBoundCommands = new Map();
        for (const defaultKeybinding of defaultKeybindings) {
            const command = defaultKeybinding.command;
            if (command && command.charAt(0) !== '-') {
                this._defaultBoundCommands.set(command, true);
            }
        }
        this._map = new Map();
        this._lookupMap = new Map();
        this._keybindings = KeybindingResolver.handleRemovals([].concat(defaultKeybindings).concat(overrides));
        for (let i = 0, len = this._keybindings.length; i < len; i++) {
            const k = this._keybindings[i];
            if (k.chords.length === 0) {
                // unbound
                continue;
            }
            if (k.when && k.when.type === 0 /* ContextKeyExprType.False */) {
                // when condition is false
                continue;
            }
            // TODO@chords
            this._addKeyPress(k.chords[0], k);
        }
    }
    static _isTargetedForRemoval(defaultKb, keypressFirstPart, keypressChordPart, when) {
        // TODO@chords
        if (keypressFirstPart && defaultKb.chords[0] !== keypressFirstPart) {
            return false;
        }
        // TODO@chords
        if (keypressChordPart && defaultKb.chords[1] !== keypressChordPart) {
            return false;
        }
        // `true` means always, as does `undefined`
        // so we will treat `true` === `undefined`
        if (when && when.type !== 1 /* ContextKeyExprType.True */) {
            if (!defaultKb.when) {
                return false;
            }
            if (!expressionsAreEqualWithConstantSubstitution(when, defaultKb.when)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Looks for rules containing "-commandId" and removes them.
     */
    static handleRemovals(rules) {
        // Do a first pass and construct a hash-map for removals
        const removals = new Map();
        for (let i = 0, len = rules.length; i < len; i++) {
            const rule = rules[i];
            if (rule.command && rule.command.charAt(0) === '-') {
                const command = rule.command.substring(1);
                if (!removals.has(command)) {
                    removals.set(command, [rule]);
                }
                else {
                    removals.get(command).push(rule);
                }
            }
        }
        if (removals.size === 0) {
            // There are no removals
            return rules;
        }
        // Do a second pass and keep only non-removed keybindings
        const result = [];
        for (let i = 0, len = rules.length; i < len; i++) {
            const rule = rules[i];
            if (!rule.command || rule.command.length === 0) {
                result.push(rule);
                continue;
            }
            if (rule.command.charAt(0) === '-') {
                continue;
            }
            const commandRemovals = removals.get(rule.command);
            if (!commandRemovals || !rule.isDefault) {
                result.push(rule);
                continue;
            }
            let isRemoved = false;
            for (const commandRemoval of commandRemovals) {
                // TODO@chords
                const keypressFirstChord = commandRemoval.chords[0];
                const keypressSecondChord = commandRemoval.chords[1];
                const when = commandRemoval.when;
                if (this._isTargetedForRemoval(rule, keypressFirstChord, keypressSecondChord, when)) {
                    isRemoved = true;
                    break;
                }
            }
            if (!isRemoved) {
                result.push(rule);
                continue;
            }
        }
        return result;
    }
    _addKeyPress(keypress, item) {
        const conflicts = this._map.get(keypress);
        if (typeof conflicts === 'undefined') {
            // There is no conflict so far
            this._map.set(keypress, [item]);
            this._addToLookupMap(item);
            return;
        }
        for (let i = conflicts.length - 1; i >= 0; i--) {
            const conflict = conflicts[i];
            if (conflict.command === item.command) {
                continue;
            }
            const conflictHasMultipleChords = (conflict.chords.length > 1);
            const itemHasMultipleChords = (item.chords.length > 1);
            // TODO@chords
            if (conflictHasMultipleChords && itemHasMultipleChords && conflict.chords[1] !== item.chords[1]) {
                // The conflict only shares the first chord with this command
                continue;
            }
            if (KeybindingResolver.whenIsEntirelyIncluded(conflict.when, item.when)) {
                // `item` completely overwrites `conflict`
                // Remove conflict from the lookupMap
                this._removeFromLookupMap(conflict);
            }
        }
        conflicts.push(item);
        this._addToLookupMap(item);
    }
    _addToLookupMap(item) {
        if (!item.command) {
            return;
        }
        let arr = this._lookupMap.get(item.command);
        if (typeof arr === 'undefined') {
            arr = [item];
            this._lookupMap.set(item.command, arr);
        }
        else {
            arr.push(item);
        }
    }
    _removeFromLookupMap(item) {
        if (!item.command) {
            return;
        }
        const arr = this._lookupMap.get(item.command);
        if (typeof arr === 'undefined') {
            return;
        }
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === item) {
                arr.splice(i, 1);
                return;
            }
        }
    }
    /**
     * Returns true if it is provable `a` implies `b`.
     */
    static whenIsEntirelyIncluded(a, b) {
        if (!b || b.type === 1 /* ContextKeyExprType.True */) {
            return true;
        }
        if (!a || a.type === 1 /* ContextKeyExprType.True */) {
            return false;
        }
        return implies(a, b);
    }
    getKeybindings() {
        return this._keybindings;
    }
    lookupPrimaryKeybinding(commandId, context) {
        const items = this._lookupMap.get(commandId);
        if (typeof items === 'undefined' || items.length === 0) {
            return null;
        }
        if (items.length === 1) {
            return items[0];
        }
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            if (context.contextMatchesRules(item.when)) {
                return item;
            }
        }
        return items[items.length - 1];
    }
    resolve(context, currentChord, keypress) {
        this._log(`| Resolving ${keypress}${currentChord ? ` chorded from ${currentChord}` : ``}`);
        let lookupMap = null;
        if (currentChord !== null) {
            // Fetch all chord bindings for `currentChord`
            const candidates = this._map.get(currentChord);
            if (typeof candidates === 'undefined') {
                // No chords starting with `currentChord`
                this._log(`\\ No keybinding entries.`);
                return null;
            }
            lookupMap = [];
            for (let i = 0, len = candidates.length; i < len; i++) {
                const candidate = candidates[i];
                // TODO@chords
                if (candidate.chords[1] === keypress) {
                    lookupMap.push(candidate);
                }
            }
        }
        else {
            const candidates = this._map.get(keypress);
            if (typeof candidates === 'undefined') {
                // No bindings with `keypress`
                this._log(`\\ No keybinding entries.`);
                return null;
            }
            lookupMap = candidates;
        }
        const result = this._findCommand(context, lookupMap);
        if (!result) {
            this._log(`\\ From ${lookupMap.length} keybinding entries, no when clauses matched the context.`);
            return null;
        }
        // TODO@chords
        if (currentChord === null && result.chords.length > 1 && result.chords[1] !== null) {
            this._log(`\\ From ${lookupMap.length} keybinding entries, matched chord, when: ${printWhenExplanation(result.when)}, source: ${printSourceExplanation(result)}.`);
            return {
                enterMultiChord: true,
                leaveMultiChord: false,
                commandId: null,
                commandArgs: null,
                bubble: false
            };
        }
        this._log(`\\ From ${lookupMap.length} keybinding entries, matched ${result.command}, when: ${printWhenExplanation(result.when)}, source: ${printSourceExplanation(result)}.`);
        return {
            enterMultiChord: false,
            leaveMultiChord: result.chords.length > 1,
            commandId: result.command,
            commandArgs: result.commandArgs,
            bubble: result.bubble
        };
    }
    _findCommand(context, matches) {
        for (let i = matches.length - 1; i >= 0; i--) {
            const k = matches[i];
            if (!KeybindingResolver._contextMatchesRules(context, k.when)) {
                continue;
            }
            return k;
        }
        return null;
    }
    static _contextMatchesRules(context, rules) {
        if (!rules) {
            return true;
        }
        return rules.evaluate(context);
    }
}
function printWhenExplanation(when) {
    if (!when) {
        return `no when condition`;
    }
    return `${when.serialize()}`;
}
function printSourceExplanation(kb) {
    return (kb.extensionId
        ? (kb.isBuiltinExtension ? `built-in extension ${kb.extensionId}` : `user extension ${kb.extensionId}`)
        : (kb.isDefault ? `built-in` : `user`));
}
