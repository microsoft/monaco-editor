import { keybindingLabelBackground, keybindingLabelBorder, keybindingLabelBottomBorder, keybindingLabelForeground, asCssVariable, widgetShadow, buttonForeground, buttonSeparator, buttonBackground, buttonHoverBackground, buttonSecondaryForeground, buttonSecondaryBackground, buttonSecondaryHoverBackground, buttonBorder, progressBarBackground, inputActiveOptionBorder, inputActiveOptionForeground, inputActiveOptionBackground, editorWidgetBackground, editorWidgetForeground, contrastBorder, checkboxBorder, checkboxBackground, checkboxForeground, problemsErrorIconForeground, problemsWarningIconForeground, problemsInfoIconForeground, inputBackground, inputForeground, inputBorder, textLinkForeground, inputValidationInfoBorder, inputValidationInfoBackground, inputValidationInfoForeground, inputValidationWarningBorder, inputValidationWarningBackground, inputValidationWarningForeground, inputValidationErrorBorder, inputValidationErrorBackground, inputValidationErrorForeground, listFilterWidgetBackground, listFilterWidgetNoMatchesOutline, listFilterWidgetOutline, listFilterWidgetShadow, badgeBackground, badgeForeground, breadcrumbsBackground, breadcrumbsForeground, breadcrumbsFocusForeground, breadcrumbsActiveSelectionForeground, activeContrastBorder, listActiveSelectionBackground, listActiveSelectionForeground, listActiveSelectionIconForeground, listDropBackground, listFocusAndSelectionOutline, listFocusBackground, listFocusForeground, listFocusOutline, listHoverBackground, listHoverForeground, listInactiveFocusBackground, listInactiveFocusOutline, listInactiveSelectionBackground, listInactiveSelectionForeground, listInactiveSelectionIconForeground, tableColumnsBorder, tableOddRowsBackgroundColor, treeIndentGuidesStroke, asCssVariableWithDefault, editorWidgetBorder, focusBorder, pickerGroupForeground, quickInputListFocusBackground, quickInputListFocusForeground, quickInputListFocusIconForeground, selectBackground, selectBorder, selectForeground, selectListBackground, treeInactiveIndentGuidesStroke, menuBorder, menuForeground, menuBackground, menuSelectionForeground, menuSelectionBackground, menuSelectionBorder, menuSeparatorBackground, scrollbarShadow, scrollbarSliderActiveBackground, scrollbarSliderBackground, scrollbarSliderHoverBackground } from '../common/colorRegistry.js';
import { Color } from '../../../base/common/color.js';
function overrideStyles(override, styles) {
    const result = Object.assign({}, styles);
    for (const key in override) {
        const val = override[key];
        result[key] = val !== undefined ? asCssVariable(val) : undefined;
    }
    return result;
}
export const defaultKeybindingLabelStyles = {
    keybindingLabelBackground: asCssVariable(keybindingLabelBackground),
    keybindingLabelForeground: asCssVariable(keybindingLabelForeground),
    keybindingLabelBorder: asCssVariable(keybindingLabelBorder),
    keybindingLabelBottomBorder: asCssVariable(keybindingLabelBottomBorder),
    keybindingLabelShadow: asCssVariable(widgetShadow)
};
export const defaultButtonStyles = {
    buttonForeground: asCssVariable(buttonForeground),
    buttonSeparator: asCssVariable(buttonSeparator),
    buttonBackground: asCssVariable(buttonBackground),
    buttonHoverBackground: asCssVariable(buttonHoverBackground),
    buttonSecondaryForeground: asCssVariable(buttonSecondaryForeground),
    buttonSecondaryBackground: asCssVariable(buttonSecondaryBackground),
    buttonSecondaryHoverBackground: asCssVariable(buttonSecondaryHoverBackground),
    buttonBorder: asCssVariable(buttonBorder),
};
export const defaultProgressBarStyles = {
    progressBarBackground: asCssVariable(progressBarBackground)
};
export const defaultToggleStyles = {
    inputActiveOptionBorder: asCssVariable(inputActiveOptionBorder),
    inputActiveOptionForeground: asCssVariable(inputActiveOptionForeground),
    inputActiveOptionBackground: asCssVariable(inputActiveOptionBackground)
};
export const defaultCheckboxStyles = {
    checkboxBackground: asCssVariable(checkboxBackground),
    checkboxBorder: asCssVariable(checkboxBorder),
    checkboxForeground: asCssVariable(checkboxForeground)
};
export const defaultDialogStyles = {
    dialogBackground: asCssVariable(editorWidgetBackground),
    dialogForeground: asCssVariable(editorWidgetForeground),
    dialogShadow: asCssVariable(widgetShadow),
    dialogBorder: asCssVariable(contrastBorder),
    errorIconForeground: asCssVariable(problemsErrorIconForeground),
    warningIconForeground: asCssVariable(problemsWarningIconForeground),
    infoIconForeground: asCssVariable(problemsInfoIconForeground),
    textLinkForeground: asCssVariable(textLinkForeground)
};
export const defaultInputBoxStyles = {
    inputBackground: asCssVariable(inputBackground),
    inputForeground: asCssVariable(inputForeground),
    inputBorder: asCssVariable(inputBorder),
    inputValidationInfoBorder: asCssVariable(inputValidationInfoBorder),
    inputValidationInfoBackground: asCssVariable(inputValidationInfoBackground),
    inputValidationInfoForeground: asCssVariable(inputValidationInfoForeground),
    inputValidationWarningBorder: asCssVariable(inputValidationWarningBorder),
    inputValidationWarningBackground: asCssVariable(inputValidationWarningBackground),
    inputValidationWarningForeground: asCssVariable(inputValidationWarningForeground),
    inputValidationErrorBorder: asCssVariable(inputValidationErrorBorder),
    inputValidationErrorBackground: asCssVariable(inputValidationErrorBackground),
    inputValidationErrorForeground: asCssVariable(inputValidationErrorForeground)
};
export const defaultFindWidgetStyles = {
    listFilterWidgetBackground: asCssVariable(listFilterWidgetBackground),
    listFilterWidgetOutline: asCssVariable(listFilterWidgetOutline),
    listFilterWidgetNoMatchesOutline: asCssVariable(listFilterWidgetNoMatchesOutline),
    listFilterWidgetShadow: asCssVariable(listFilterWidgetShadow),
    inputBoxStyles: defaultInputBoxStyles,
    toggleStyles: defaultToggleStyles
};
export const defaultCountBadgeStyles = {
    badgeBackground: asCssVariable(badgeBackground),
    badgeForeground: asCssVariable(badgeForeground),
    badgeBorder: asCssVariable(contrastBorder)
};
export const defaultBreadcrumbsWidgetStyles = {
    breadcrumbsBackground: asCssVariable(breadcrumbsBackground),
    breadcrumbsForeground: asCssVariable(breadcrumbsForeground),
    breadcrumbsHoverForeground: asCssVariable(breadcrumbsFocusForeground),
    breadcrumbsFocusForeground: asCssVariable(breadcrumbsFocusForeground),
    breadcrumbsFocusAndSelectionForeground: asCssVariable(breadcrumbsActiveSelectionForeground)
};
export const defaultListStyles = {
    listBackground: undefined,
    listInactiveFocusForeground: undefined,
    listFocusBackground: asCssVariable(listFocusBackground),
    listFocusForeground: asCssVariable(listFocusForeground),
    listFocusOutline: asCssVariable(listFocusOutline),
    listActiveSelectionBackground: asCssVariable(listActiveSelectionBackground),
    listActiveSelectionForeground: asCssVariable(listActiveSelectionForeground),
    listActiveSelectionIconForeground: asCssVariable(listActiveSelectionIconForeground),
    listFocusAndSelectionOutline: asCssVariable(listFocusAndSelectionOutline),
    listFocusAndSelectionBackground: asCssVariable(listActiveSelectionBackground),
    listFocusAndSelectionForeground: asCssVariable(listActiveSelectionForeground),
    listInactiveSelectionBackground: asCssVariable(listInactiveSelectionBackground),
    listInactiveSelectionIconForeground: asCssVariable(listInactiveSelectionIconForeground),
    listInactiveSelectionForeground: asCssVariable(listInactiveSelectionForeground),
    listInactiveFocusBackground: asCssVariable(listInactiveFocusBackground),
    listInactiveFocusOutline: asCssVariable(listInactiveFocusOutline),
    listHoverBackground: asCssVariable(listHoverBackground),
    listHoverForeground: asCssVariable(listHoverForeground),
    listDropBackground: asCssVariable(listDropBackground),
    listSelectionOutline: asCssVariable(activeContrastBorder),
    listHoverOutline: asCssVariable(activeContrastBorder),
    treeIndentGuidesStroke: asCssVariable(treeIndentGuidesStroke),
    treeInactiveIndentGuidesStroke: asCssVariable(treeInactiveIndentGuidesStroke),
    tableColumnsBorder: asCssVariable(tableColumnsBorder),
    tableOddRowsBackgroundColor: asCssVariable(tableOddRowsBackgroundColor),
};
export function getListStyles(override) {
    return overrideStyles(override, defaultListStyles);
}
export const defaultSelectBoxStyles = {
    selectBackground: asCssVariable(selectBackground),
    selectListBackground: asCssVariable(selectListBackground),
    selectForeground: asCssVariable(selectForeground),
    decoratorRightForeground: asCssVariable(pickerGroupForeground),
    selectBorder: asCssVariable(selectBorder),
    focusBorder: asCssVariable(focusBorder),
    listFocusBackground: asCssVariable(quickInputListFocusBackground),
    listInactiveSelectionIconForeground: asCssVariable(quickInputListFocusIconForeground),
    listFocusForeground: asCssVariable(quickInputListFocusForeground),
    listFocusOutline: asCssVariableWithDefault(activeContrastBorder, Color.transparent.toString()),
    listHoverBackground: asCssVariable(listHoverBackground),
    listHoverForeground: asCssVariable(listHoverForeground),
    listHoverOutline: asCssVariable(activeContrastBorder),
    selectListBorder: asCssVariable(editorWidgetBorder),
    listBackground: undefined,
    listActiveSelectionBackground: undefined,
    listActiveSelectionForeground: undefined,
    listActiveSelectionIconForeground: undefined,
    listFocusAndSelectionBackground: undefined,
    listDropBackground: undefined,
    listInactiveSelectionBackground: undefined,
    listInactiveSelectionForeground: undefined,
    listInactiveFocusBackground: undefined,
    listInactiveFocusOutline: undefined,
    listSelectionOutline: undefined,
    listFocusAndSelectionForeground: undefined,
    listFocusAndSelectionOutline: undefined,
    listInactiveFocusForeground: undefined,
    tableColumnsBorder: undefined,
    tableOddRowsBackgroundColor: undefined,
    treeIndentGuidesStroke: undefined,
    treeInactiveIndentGuidesStroke: undefined,
};
export const defaultMenuStyles = {
    shadowColor: asCssVariable(widgetShadow),
    borderColor: asCssVariable(menuBorder),
    foregroundColor: asCssVariable(menuForeground),
    backgroundColor: asCssVariable(menuBackground),
    selectionForegroundColor: asCssVariable(menuSelectionForeground),
    selectionBackgroundColor: asCssVariable(menuSelectionBackground),
    selectionBorderColor: asCssVariable(menuSelectionBorder),
    separatorColor: asCssVariable(menuSeparatorBackground),
    scrollbarShadow: asCssVariable(scrollbarShadow),
    scrollbarSliderBackground: asCssVariable(scrollbarSliderBackground),
    scrollbarSliderHoverBackground: asCssVariable(scrollbarSliderHoverBackground),
    scrollbarSliderActiveBackground: asCssVariable(scrollbarSliderActiveBackground)
};
