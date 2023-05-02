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
import { Emitter } from './event.js';
import { Disposable } from './lifecycle.js';
import * as nls from '../../nls.js';
export class Action extends Disposable {
    constructor(id, label = '', cssClass = '', enabled = true, actionCallback) {
        super();
        this._onDidChange = this._register(new Emitter());
        this.onDidChange = this._onDidChange.event;
        this._enabled = true;
        this._id = id;
        this._label = label;
        this._cssClass = cssClass;
        this._enabled = enabled;
        this._actionCallback = actionCallback;
    }
    get id() {
        return this._id;
    }
    get label() {
        return this._label;
    }
    set label(value) {
        this._setLabel(value);
    }
    _setLabel(value) {
        if (this._label !== value) {
            this._label = value;
            this._onDidChange.fire({ label: value });
        }
    }
    get tooltip() {
        return this._tooltip || '';
    }
    set tooltip(value) {
        this._setTooltip(value);
    }
    _setTooltip(value) {
        if (this._tooltip !== value) {
            this._tooltip = value;
            this._onDidChange.fire({ tooltip: value });
        }
    }
    get class() {
        return this._cssClass;
    }
    set class(value) {
        this._setClass(value);
    }
    _setClass(value) {
        if (this._cssClass !== value) {
            this._cssClass = value;
            this._onDidChange.fire({ class: value });
        }
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        this._setEnabled(value);
    }
    _setEnabled(value) {
        if (this._enabled !== value) {
            this._enabled = value;
            this._onDidChange.fire({ enabled: value });
        }
    }
    get checked() {
        return this._checked;
    }
    set checked(value) {
        this._setChecked(value);
    }
    _setChecked(value) {
        if (this._checked !== value) {
            this._checked = value;
            this._onDidChange.fire({ checked: value });
        }
    }
    run(event, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._actionCallback) {
                yield this._actionCallback(event);
            }
        });
    }
}
export class ActionRunner extends Disposable {
    constructor() {
        super(...arguments);
        this._onWillRun = this._register(new Emitter());
        this.onWillRun = this._onWillRun.event;
        this._onDidRun = this._register(new Emitter());
        this.onDidRun = this._onDidRun.event;
    }
    run(action, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!action.enabled) {
                return;
            }
            this._onWillRun.fire({ action });
            let error = undefined;
            try {
                yield this.runAction(action, context);
            }
            catch (e) {
                error = e;
            }
            this._onDidRun.fire({ action, error });
        });
    }
    runAction(action, context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield action.run(context);
        });
    }
}
export class Separator {
    constructor() {
        this.id = Separator.ID;
        this.label = '';
        this.tooltip = '';
        this.class = 'separator';
        this.enabled = false;
        this.checked = false;
    }
    /**
     * Joins all non-empty lists of actions with separators.
     */
    static join(...actionLists) {
        let out = [];
        for (const list of actionLists) {
            if (!list.length) {
                // skip
            }
            else if (out.length) {
                out = [...out, new Separator(), ...list];
            }
            else {
                out = list;
            }
        }
        return out;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
Separator.ID = 'vs.actions.separator';
export class SubmenuAction {
    get actions() { return this._actions; }
    constructor(id, label, actions, cssClass) {
        this.tooltip = '';
        this.enabled = true;
        this.checked = undefined;
        this.id = id;
        this.label = label;
        this.class = cssClass;
        this._actions = actions;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
export class EmptySubmenuAction extends Action {
    constructor() {
        super(EmptySubmenuAction.ID, nls.localize('submenu.empty', '(empty)'), undefined, false);
    }
}
EmptySubmenuAction.ID = 'vs.actions.empty';
export function toAction(props) {
    var _a, _b;
    return {
        id: props.id,
        label: props.label,
        class: undefined,
        enabled: (_a = props.enabled) !== null && _a !== void 0 ? _a : true,
        checked: (_b = props.checked) !== null && _b !== void 0 ? _b : false,
        run: () => __awaiter(this, void 0, void 0, function* () { return props.run(); }),
        tooltip: props.label
    };
}
