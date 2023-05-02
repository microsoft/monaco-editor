/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as dom from '../../../../base/browser/dom.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { toAction } from '../../../../base/common/actions.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import './postDropWidget.css';
import { localize } from '../../../../nls.js';
import { IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
export const changeDropTypeCommandId = 'editor.changeDropType';
export const dropWidgetVisibleCtx = new RawContextKey('dropWidgetVisible', false, localize('dropWidgetVisible', "Whether the drop widget is showing"));
let PostDropWidget = class PostDropWidget extends Disposable {
    constructor(editor, range, edits, onSelectNewEdit, _contextMenuService, contextKeyService, _keybindingService) {
        super();
        this.editor = editor;
        this.range = range;
        this.edits = edits;
        this.onSelectNewEdit = onSelectNewEdit;
        this._contextMenuService = _contextMenuService;
        this._keybindingService = _keybindingService;
        this.allowEditorOverflow = true;
        this.suppressMouseDown = true;
        this.create();
        this.dropWidgetVisible = dropWidgetVisibleCtx.bindTo(contextKeyService);
        this.dropWidgetVisible.set(true);
        this._register(toDisposable(() => this.dropWidgetVisible.reset()));
        this.editor.addContentWidget(this);
        this.editor.layoutContentWidget(this);
        this._register(toDisposable((() => this.editor.removeContentWidget(this))));
        this._register(this.editor.onDidChangeCursorPosition(e => {
            if (!range.containsPosition(e.position)) {
                this.dispose();
            }
        }));
        this._register(Event.runAndSubscribe(_keybindingService.onDidUpdateKeybindings, () => {
            this._updateButtonTitle();
        }));
    }
    _updateButtonTitle() {
        var _a;
        const binding = (_a = this._keybindingService.lookupKeybinding(changeDropTypeCommandId)) === null || _a === void 0 ? void 0 : _a.getLabel();
        this.button.element.title = binding
            ? localize('postDropWidgetTitleWithBinding', "Show drop options... ({0})", binding)
            : localize('postDropWidgetTitle', "Show drop options...");
    }
    create() {
        this.domNode = dom.$('.post-drop-widget');
        this.button = this._register(new Button(this.domNode, {
            supportIcons: true,
        }));
        this.button.label = '$(insert)';
        this._register(dom.addDisposableListener(this.domNode, dom.EventType.CLICK, () => this.showDropSelector()));
    }
    getId() {
        return PostDropWidget.ID;
    }
    getDomNode() {
        return this.domNode;
    }
    getPosition() {
        return {
            position: this.range.getEndPosition(),
            preference: [2 /* ContentWidgetPositionPreference.BELOW */]
        };
    }
    showDropSelector() {
        this._contextMenuService.showContextMenu({
            getAnchor: () => {
                const pos = dom.getDomNodePagePosition(this.button.element);
                return { x: pos.left + pos.width, y: pos.top + pos.height };
            },
            getActions: () => {
                return this.edits.allEdits.map((edit, i) => toAction({
                    id: '',
                    label: edit.label,
                    checked: i === this.edits.activeEditIndex,
                    run: () => {
                        if (i !== this.edits.activeEditIndex) {
                            return this.onSelectNewEdit(i);
                        }
                    },
                }));
            }
        });
    }
};
PostDropWidget.ID = 'editor.widget.postDropWidget';
PostDropWidget = __decorate([
    __param(4, IContextMenuService),
    __param(5, IContextKeyService),
    __param(6, IKeybindingService)
], PostDropWidget);
export let PostDropWidgetManager = class PostDropWidgetManager extends Disposable {
    constructor(_editor, _instantiationService) {
        super();
        this._editor = _editor;
        this._instantiationService = _instantiationService;
        this._currentWidget = this._register(new MutableDisposable());
        this._register(Event.any(_editor.onDidChangeModel, _editor.onDidChangeModelContent)(() => this.clear()));
    }
    show(range, edits, onDidSelectEdit) {
        this.clear();
        if (this._editor.hasModel()) {
            this._currentWidget.value = this._instantiationService.createInstance(PostDropWidget, this._editor, range, edits, onDidSelectEdit);
        }
    }
    clear() {
        this._currentWidget.clear();
    }
    changeExistingDropType() {
        var _a;
        (_a = this._currentWidget.value) === null || _a === void 0 ? void 0 : _a.showDropSelector();
    }
};
PostDropWidgetManager = __decorate([
    __param(1, IInstantiationService)
], PostDropWidgetManager);
