/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Codicon } from '../../../../base/common/codicons.js';
import { MinimapPosition } from '../../../common/model.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { localize } from '../../../../nls.js';
import { editorSelectionBackground, iconForeground, registerColor, transparent } from '../../../../platform/theme/common/colorRegistry.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { themeColorFromId } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
const foldBackground = registerColor('editor.foldBackground', { light: transparent(editorSelectionBackground, 0.3), dark: transparent(editorSelectionBackground, 0.3), hcDark: null, hcLight: null }, localize('foldBackgroundBackground', "Background color behind folded ranges. The color must not be opaque so as not to hide underlying decorations."), true);
registerColor('editorGutter.foldingControlForeground', { dark: iconForeground, light: iconForeground, hcDark: iconForeground, hcLight: iconForeground }, localize('editorGutter.foldingControlForeground', 'Color of the folding control in the editor gutter.'));
export const foldingExpandedIcon = registerIcon('folding-expanded', Codicon.chevronDown, localize('foldingExpandedIcon', 'Icon for expanded ranges in the editor glyph margin.'));
export const foldingCollapsedIcon = registerIcon('folding-collapsed', Codicon.chevronRight, localize('foldingCollapsedIcon', 'Icon for collapsed ranges in the editor glyph margin.'));
export const foldingManualCollapsedIcon = registerIcon('folding-manual-collapsed', foldingCollapsedIcon, localize('foldingManualCollapedIcon', 'Icon for manually collapsed ranges in the editor glyph margin.'));
export const foldingManualExpandedIcon = registerIcon('folding-manual-expanded', foldingExpandedIcon, localize('foldingManualExpandedIcon', 'Icon for manually expanded ranges in the editor glyph margin.'));
const foldedBackgroundMinimap = { color: themeColorFromId(foldBackground), position: MinimapPosition.Inline };
export class FoldingDecorationProvider {
    constructor(editor) {
        this.editor = editor;
        this.showFoldingControls = 'mouseover';
        this.showFoldingHighlights = true;
    }
    getDecorationOption(isCollapsed, isHidden, isManual) {
        if (isHidden) { // is inside another collapsed region
            return FoldingDecorationProvider.HIDDEN_RANGE_DECORATION;
        }
        if (this.showFoldingControls === 'never') {
            if (isCollapsed) {
                return this.showFoldingHighlights ? FoldingDecorationProvider.NO_CONTROLS_COLLAPSED_HIGHLIGHTED_RANGE_DECORATION : FoldingDecorationProvider.NO_CONTROLS_COLLAPSED_RANGE_DECORATION;
            }
            return FoldingDecorationProvider.NO_CONTROLS_EXPANDED_RANGE_DECORATION;
        }
        if (isCollapsed) {
            return isManual ?
                (this.showFoldingHighlights ? FoldingDecorationProvider.MANUALLY_COLLAPSED_HIGHLIGHTED_VISUAL_DECORATION : FoldingDecorationProvider.MANUALLY_COLLAPSED_VISUAL_DECORATION)
                : (this.showFoldingHighlights ? FoldingDecorationProvider.COLLAPSED_HIGHLIGHTED_VISUAL_DECORATION : FoldingDecorationProvider.COLLAPSED_VISUAL_DECORATION);
        }
        else if (this.showFoldingControls === 'mouseover') {
            return isManual ? FoldingDecorationProvider.MANUALLY_EXPANDED_AUTO_HIDE_VISUAL_DECORATION : FoldingDecorationProvider.EXPANDED_AUTO_HIDE_VISUAL_DECORATION;
        }
        else {
            return isManual ? FoldingDecorationProvider.MANUALLY_EXPANDED_VISUAL_DECORATION : FoldingDecorationProvider.EXPANDED_VISUAL_DECORATION;
        }
    }
    changeDecorations(callback) {
        return this.editor.changeDecorations(callback);
    }
    removeDecorations(decorationIds) {
        this.editor.removeDecorations(decorationIds);
    }
}
FoldingDecorationProvider.COLLAPSED_VISUAL_DECORATION = ModelDecorationOptions.register({
    description: 'folding-collapsed-visual-decoration',
    stickiness: 0 /* TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges */,
    afterContentClassName: 'inline-folded',
    isWholeLine: true,
    firstLineDecorationClassName: ThemeIcon.asClassName(foldingCollapsedIcon),
});
FoldingDecorationProvider.COLLAPSED_HIGHLIGHTED_VISUAL_DECORATION = ModelDecorationOptions.register({
    description: 'folding-collapsed-highlighted-visual-decoration',
    stickiness: 0 /* TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges */,
    afterContentClassName: 'inline-folded',
    className: 'folded-background',
    minimap: foldedBackgroundMinimap,
    isWholeLine: true,
    firstLineDecorationClassName: ThemeIcon.asClassName(foldingCollapsedIcon)
});
FoldingDecorationProvider.MANUALLY_COLLAPSED_VISUAL_DECORATION = ModelDecorationOptions.register({
    description: 'folding-manually-collapsed-visual-decoration',
    stickiness: 0 /* TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges */,
    afterContentClassName: 'inline-folded',
    isWholeLine: true,
    firstLineDecorationClassName: ThemeIcon.asClassName(foldingManualCollapsedIcon)
});
FoldingDecorationProvider.MANUALLY_COLLAPSED_HIGHLIGHTED_VISUAL_DECORATION = ModelDecorationOptions.register({
    description: 'folding-manually-collapsed-highlighted-visual-decoration',
    stickiness: 0 /* TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges */,
    afterContentClassName: 'inline-folded',
    className: 'folded-background',
    minimap: foldedBackgroundMinimap,
    isWholeLine: true,
    firstLineDecorationClassName: ThemeIcon.asClassName(foldingManualCollapsedIcon)
});
FoldingDecorationProvider.NO_CONTROLS_COLLAPSED_RANGE_DECORATION = ModelDecorationOptions.register({
    description: 'folding-no-controls-range-decoration',
    stickiness: 0 /* TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges */,
    afterContentClassName: 'inline-folded',
    isWholeLine: true
});
FoldingDecorationProvider.NO_CONTROLS_COLLAPSED_HIGHLIGHTED_RANGE_DECORATION = ModelDecorationOptions.register({
    description: 'folding-no-controls-range-decoration',
    stickiness: 0 /* TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges */,
    afterContentClassName: 'inline-folded',
    className: 'folded-background',
    minimap: foldedBackgroundMinimap,
    isWholeLine: true
});
FoldingDecorationProvider.EXPANDED_VISUAL_DECORATION = ModelDecorationOptions.register({
    description: 'folding-expanded-visual-decoration',
    stickiness: 1 /* TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges */,
    isWholeLine: true,
    firstLineDecorationClassName: 'alwaysShowFoldIcons ' + ThemeIcon.asClassName(foldingExpandedIcon)
});
FoldingDecorationProvider.EXPANDED_AUTO_HIDE_VISUAL_DECORATION = ModelDecorationOptions.register({
    description: 'folding-expanded-auto-hide-visual-decoration',
    stickiness: 1 /* TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges */,
    isWholeLine: true,
    firstLineDecorationClassName: ThemeIcon.asClassName(foldingExpandedIcon)
});
FoldingDecorationProvider.MANUALLY_EXPANDED_VISUAL_DECORATION = ModelDecorationOptions.register({
    description: 'folding-manually-expanded-visual-decoration',
    stickiness: 0 /* TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges */,
    isWholeLine: true,
    firstLineDecorationClassName: 'alwaysShowFoldIcons ' + ThemeIcon.asClassName(foldingManualExpandedIcon)
});
FoldingDecorationProvider.MANUALLY_EXPANDED_AUTO_HIDE_VISUAL_DECORATION = ModelDecorationOptions.register({
    description: 'folding-manually-expanded-auto-hide-visual-decoration',
    stickiness: 0 /* TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges */,
    isWholeLine: true,
    firstLineDecorationClassName: ThemeIcon.asClassName(foldingManualExpandedIcon)
});
FoldingDecorationProvider.NO_CONTROLS_EXPANDED_RANGE_DECORATION = ModelDecorationOptions.register({
    description: 'folding-no-controls-range-decoration',
    stickiness: 0 /* TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges */,
    isWholeLine: true
});
FoldingDecorationProvider.HIDDEN_RANGE_DECORATION = ModelDecorationOptions.register({
    description: 'folding-hidden-range-decoration',
    stickiness: 1 /* TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges */
});
