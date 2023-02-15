/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _CodeActionModel_isDisposed;
import { createCancelablePromise, TimeoutTimer } from '../../../../base/common/async.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { isEqual } from '../../../../base/common/resources.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { Progress } from '../../../../platform/progress/common/progress.js';
import { getCodeActions } from './codeAction.js';
import { CodeActionTriggerSource } from '../common/types.js';
export const SUPPORTED_CODE_ACTIONS = new RawContextKey('supportedCodeAction', '');
class CodeActionOracle extends Disposable {
    constructor(_editor, _markerService, _signalChange, _delay = 250) {
        super();
        this._editor = _editor;
        this._markerService = _markerService;
        this._signalChange = _signalChange;
        this._delay = _delay;
        this._autoTriggerTimer = this._register(new TimeoutTimer());
        this._register(this._markerService.onMarkerChanged(e => this._onMarkerChanges(e)));
        this._register(this._editor.onDidChangeCursorPosition(() => this._onCursorChange()));
    }
    trigger(trigger) {
        const selection = this._getRangeOfSelectionUnlessWhitespaceEnclosed(trigger);
        return this._createEventAndSignalChange(trigger, selection);
    }
    _onMarkerChanges(resources) {
        const model = this._editor.getModel();
        if (!model) {
            return;
        }
        if (resources.some(resource => isEqual(resource, model.uri))) {
            this._autoTriggerTimer.cancelAndSet(() => {
                this.trigger({ type: 2 /* CodeActionTriggerType.Auto */, triggerAction: CodeActionTriggerSource.Default });
            }, this._delay);
        }
    }
    _onCursorChange() {
        this._autoTriggerTimer.cancelAndSet(() => {
            this.trigger({ type: 2 /* CodeActionTriggerType.Auto */, triggerAction: CodeActionTriggerSource.Default });
        }, this._delay);
    }
    _getRangeOfSelectionUnlessWhitespaceEnclosed(trigger) {
        if (!this._editor.hasModel()) {
            return undefined;
        }
        const model = this._editor.getModel();
        const selection = this._editor.getSelection();
        if (selection.isEmpty() && trigger.type === 2 /* CodeActionTriggerType.Auto */) {
            const { lineNumber, column } = selection.getPosition();
            const line = model.getLineContent(lineNumber);
            if (line.length === 0) {
                // empty line
                return undefined;
            }
            else if (column === 1) {
                // look only right
                if (/\s/.test(line[0])) {
                    return undefined;
                }
            }
            else if (column === model.getLineMaxColumn(lineNumber)) {
                // look only left
                if (/\s/.test(line[line.length - 1])) {
                    return undefined;
                }
            }
            else {
                // look left and right
                if (/\s/.test(line[column - 2]) && /\s/.test(line[column - 1])) {
                    return undefined;
                }
            }
        }
        return selection;
    }
    _createEventAndSignalChange(trigger, selection) {
        const model = this._editor.getModel();
        if (!selection || !model) {
            // cancel
            this._signalChange(undefined);
            return undefined;
        }
        const e = {
            trigger,
            selection,
            position: selection.getStartPosition(),
        };
        this._signalChange(e);
        return e;
    }
}
export var CodeActionsState;
(function (CodeActionsState) {
    CodeActionsState.Empty = { type: 0 /* Type.Empty */ };
    class Triggered {
        constructor(trigger, rangeOrSelection, position, _cancellablePromise) {
            this.trigger = trigger;
            this.rangeOrSelection = rangeOrSelection;
            this.position = position;
            this._cancellablePromise = _cancellablePromise;
            this.type = 1 /* Type.Triggered */;
            this.actions = _cancellablePromise.catch((e) => {
                if (isCancellationError(e)) {
                    return emptyCodeActionSet;
                }
                throw e;
            });
        }
        cancel() {
            this._cancellablePromise.cancel();
        }
    }
    CodeActionsState.Triggered = Triggered;
})(CodeActionsState || (CodeActionsState = {}));
const emptyCodeActionSet = {
    allActions: [],
    validActions: [],
    dispose: () => { },
    documentation: [],
    hasAutoFix: false
};
export class CodeActionModel extends Disposable {
    constructor(_editor, _registry, _markerService, contextKeyService, _progressService) {
        super();
        this._editor = _editor;
        this._registry = _registry;
        this._markerService = _markerService;
        this._progressService = _progressService;
        this._codeActionOracle = this._register(new MutableDisposable());
        this._state = CodeActionsState.Empty;
        this._onDidChangeState = this._register(new Emitter());
        this.onDidChangeState = this._onDidChangeState.event;
        _CodeActionModel_isDisposed.set(this, false);
        this._supportedCodeActions = SUPPORTED_CODE_ACTIONS.bindTo(contextKeyService);
        this._register(this._editor.onDidChangeModel(() => this._update()));
        this._register(this._editor.onDidChangeModelLanguage(() => this._update()));
        this._register(this._registry.onDidChange(() => this._update()));
        this._update();
    }
    dispose() {
        if (__classPrivateFieldGet(this, _CodeActionModel_isDisposed, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _CodeActionModel_isDisposed, true, "f");
        super.dispose();
        this.setState(CodeActionsState.Empty, true);
    }
    _update() {
        if (__classPrivateFieldGet(this, _CodeActionModel_isDisposed, "f")) {
            return;
        }
        this._codeActionOracle.value = undefined;
        this.setState(CodeActionsState.Empty);
        const model = this._editor.getModel();
        if (model
            && this._registry.has(model)
            && !this._editor.getOption(86 /* EditorOption.readOnly */)) {
            const supportedActions = [];
            for (const provider of this._registry.all(model)) {
                if (Array.isArray(provider.providedCodeActionKinds)) {
                    supportedActions.push(...provider.providedCodeActionKinds);
                }
            }
            this._supportedCodeActions.set(supportedActions.join(' '));
            this._codeActionOracle.value = new CodeActionOracle(this._editor, this._markerService, trigger => {
                var _a;
                if (!trigger) {
                    this.setState(CodeActionsState.Empty);
                    return;
                }
                const actions = createCancelablePromise(token => getCodeActions(this._registry, model, trigger.selection, trigger.trigger, Progress.None, token));
                if (trigger.trigger.type === 1 /* CodeActionTriggerType.Invoke */) {
                    (_a = this._progressService) === null || _a === void 0 ? void 0 : _a.showWhile(actions, 250);
                }
                this.setState(new CodeActionsState.Triggered(trigger.trigger, trigger.selection, trigger.position, actions));
            }, undefined);
            this._codeActionOracle.value.trigger({ type: 2 /* CodeActionTriggerType.Auto */, triggerAction: CodeActionTriggerSource.Default });
        }
        else {
            this._supportedCodeActions.reset();
        }
    }
    trigger(trigger) {
        var _a;
        (_a = this._codeActionOracle.value) === null || _a === void 0 ? void 0 : _a.trigger(trigger);
    }
    setState(newState, skipNotify) {
        if (newState === this._state) {
            return;
        }
        // Cancel old request
        if (this._state.type === 1 /* CodeActionsState.Type.Triggered */) {
            this._state.cancel();
        }
        this._state = newState;
        if (!skipNotify && !__classPrivateFieldGet(this, _CodeActionModel_isDisposed, "f")) {
            this._onDidChangeState.fire(newState);
        }
    }
}
_CodeActionModel_isDisposed = new WeakMap();
