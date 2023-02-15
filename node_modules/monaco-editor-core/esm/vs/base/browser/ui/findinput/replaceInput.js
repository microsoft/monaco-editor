/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as dom from '../../dom.js';
import { Toggle } from '../toggle/toggle.js';
import { HistoryInputBox } from '../inputbox/inputBox.js';
import { Widget } from '../widget.js';
import { Codicon } from '../../../common/codicons.js';
import { Emitter } from '../../../common/event.js';
import './findInput.css';
import * as nls from '../../../../nls.js';
const NLS_DEFAULT_LABEL = nls.localize('defaultLabel', "input");
const NLS_PRESERVE_CASE_LABEL = nls.localize('label.preserveCaseToggle', "Preserve Case");
class PreserveCaseToggle extends Toggle {
    constructor(opts) {
        super({
            // TODO: does this need its own icon?
            icon: Codicon.preserveCase,
            title: NLS_PRESERVE_CASE_LABEL + opts.appendTitle,
            isChecked: opts.isChecked,
            inputActiveOptionBorder: opts.inputActiveOptionBorder,
            inputActiveOptionForeground: opts.inputActiveOptionForeground,
            inputActiveOptionBackground: opts.inputActiveOptionBackground
        });
    }
}
export class ReplaceInput extends Widget {
    constructor(parent, contextViewProvider, _showOptionButtons, options) {
        super();
        this._showOptionButtons = _showOptionButtons;
        this.fixFocusOnOptionClickEnabled = true;
        this.cachedOptionsWidth = 0;
        this._onDidOptionChange = this._register(new Emitter());
        this.onDidOptionChange = this._onDidOptionChange.event;
        this._onKeyDown = this._register(new Emitter());
        this.onKeyDown = this._onKeyDown.event;
        this._onMouseDown = this._register(new Emitter());
        this._onInput = this._register(new Emitter());
        this._onKeyUp = this._register(new Emitter());
        this._onPreserveCaseKeyDown = this._register(new Emitter());
        this.onPreserveCaseKeyDown = this._onPreserveCaseKeyDown.event;
        this.contextViewProvider = contextViewProvider;
        this.placeholder = options.placeholder || '';
        this.validation = options.validation;
        this.label = options.label || NLS_DEFAULT_LABEL;
        const appendPreserveCaseLabel = options.appendPreserveCaseLabel || '';
        const history = options.history || [];
        const flexibleHeight = !!options.flexibleHeight;
        const flexibleWidth = !!options.flexibleWidth;
        const flexibleMaxHeight = options.flexibleMaxHeight;
        this.domNode = document.createElement('div');
        this.domNode.classList.add('monaco-findInput');
        this.inputBox = this._register(new HistoryInputBox(this.domNode, this.contextViewProvider, {
            ariaLabel: this.label || '',
            placeholder: this.placeholder || '',
            validationOptions: {
                validation: this.validation
            },
            history,
            showHistoryHint: options.showHistoryHint,
            flexibleHeight,
            flexibleWidth,
            flexibleMaxHeight,
            inputBoxStyles: options.inputBoxStyles
        }));
        this.preserveCase = this._register(new PreserveCaseToggle(Object.assign({ appendTitle: appendPreserveCaseLabel, isChecked: false }, options.toggleStyles)));
        this._register(this.preserveCase.onChange(viaKeyboard => {
            this._onDidOptionChange.fire(viaKeyboard);
            if (!viaKeyboard && this.fixFocusOnOptionClickEnabled) {
                this.inputBox.focus();
            }
            this.validate();
        }));
        this._register(this.preserveCase.onKeyDown(e => {
            this._onPreserveCaseKeyDown.fire(e);
        }));
        if (this._showOptionButtons) {
            this.cachedOptionsWidth = this.preserveCase.width();
        }
        else {
            this.cachedOptionsWidth = 0;
        }
        // Arrow-Key support to navigate between options
        const indexes = [this.preserveCase.domNode];
        this.onkeydown(this.domNode, (event) => {
            if (event.equals(15 /* KeyCode.LeftArrow */) || event.equals(17 /* KeyCode.RightArrow */) || event.equals(9 /* KeyCode.Escape */)) {
                const index = indexes.indexOf(document.activeElement);
                if (index >= 0) {
                    let newIndex = -1;
                    if (event.equals(17 /* KeyCode.RightArrow */)) {
                        newIndex = (index + 1) % indexes.length;
                    }
                    else if (event.equals(15 /* KeyCode.LeftArrow */)) {
                        if (index === 0) {
                            newIndex = indexes.length - 1;
                        }
                        else {
                            newIndex = index - 1;
                        }
                    }
                    if (event.equals(9 /* KeyCode.Escape */)) {
                        indexes[index].blur();
                        this.inputBox.focus();
                    }
                    else if (newIndex >= 0) {
                        indexes[newIndex].focus();
                    }
                    dom.EventHelper.stop(event, true);
                }
            }
        });
        const controls = document.createElement('div');
        controls.className = 'controls';
        controls.style.display = this._showOptionButtons ? 'block' : 'none';
        controls.appendChild(this.preserveCase.domNode);
        this.domNode.appendChild(controls);
        parent === null || parent === void 0 ? void 0 : parent.appendChild(this.domNode);
        this.onkeydown(this.inputBox.inputElement, (e) => this._onKeyDown.fire(e));
        this.onkeyup(this.inputBox.inputElement, (e) => this._onKeyUp.fire(e));
        this.oninput(this.inputBox.inputElement, (e) => this._onInput.fire());
        this.onmousedown(this.inputBox.inputElement, (e) => this._onMouseDown.fire(e));
    }
    enable() {
        this.domNode.classList.remove('disabled');
        this.inputBox.enable();
        this.preserveCase.enable();
    }
    disable() {
        this.domNode.classList.add('disabled');
        this.inputBox.disable();
        this.preserveCase.disable();
    }
    setEnabled(enabled) {
        if (enabled) {
            this.enable();
        }
        else {
            this.disable();
        }
    }
    select() {
        this.inputBox.select();
    }
    focus() {
        this.inputBox.focus();
    }
    getPreserveCase() {
        return this.preserveCase.checked;
    }
    setPreserveCase(value) {
        this.preserveCase.checked = value;
    }
    focusOnPreserve() {
        this.preserveCase.focus();
    }
    validate() {
        var _a;
        (_a = this.inputBox) === null || _a === void 0 ? void 0 : _a.validate();
    }
    set width(newWidth) {
        this.inputBox.paddingRight = this.cachedOptionsWidth;
        this.domNode.style.width = newWidth + 'px';
    }
    dispose() {
        super.dispose();
    }
}
