/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Disposable } from '../../../../base/common/lifecycle.js';
import { registerEditorContribution } from '../../../browser/editorExtensions.js';
import { Range } from '../../../common/core/range.js';
import { ColorDecorationInjectedTextMarker } from './colorDetector.js';
import { ColorHoverParticipant } from './colorHoverParticipant.js';
import { ModesHoverController } from '../../hover/browser/hover.js';
import { HoverParticipantRegistry } from '../../hover/browser/hoverTypes.js';
export class ColorContribution extends Disposable {
    constructor(_editor) {
        super();
        this._editor = _editor;
        this._register(_editor.onMouseDown((e) => this.onMouseDown(e)));
    }
    dispose() {
        super.dispose();
    }
    onMouseDown(mouseEvent) {
        const colorDecoratorsActivatedOn = this._editor.getOption(144 /* EditorOption.colorDecoratorsActivatedOn */);
        if (colorDecoratorsActivatedOn !== 'click' && colorDecoratorsActivatedOn !== 'clickAndHover') {
            return;
        }
        const target = mouseEvent.target;
        if (target.type !== 6 /* MouseTargetType.CONTENT_TEXT */) {
            return;
        }
        if (!target.detail.injectedText) {
            return;
        }
        if (target.detail.injectedText.options.attachedData !== ColorDecorationInjectedTextMarker) {
            return;
        }
        if (!target.range) {
            return;
        }
        const hoverController = this._editor.getContribution(ModesHoverController.ID);
        if (!hoverController) {
            return;
        }
        if (!hoverController.isColorPickerVisible()) {
            const range = new Range(target.range.startLineNumber, target.range.startColumn + 1, target.range.endLineNumber, target.range.endColumn + 1);
            hoverController.showContentHover(range, 1 /* HoverStartMode.Immediate */, 0 /* HoverStartSource.Mouse */, false, true);
        }
    }
}
ColorContribution.ID = 'editor.contrib.colorContribution'; // ms
registerEditorContribution(ColorContribution.ID, ColorContribution, 2 /* EditorContributionInstantiation.BeforeFirstInteraction */);
HoverParticipantRegistry.register(ColorHoverParticipant);
