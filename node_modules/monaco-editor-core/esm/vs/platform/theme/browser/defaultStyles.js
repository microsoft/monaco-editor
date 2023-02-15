import { keybindingLabelBackground, keybindingLabelBorder, keybindingLabelBottomBorder, keybindingLabelForeground, asCssVariable, widgetShadow, buttonForeground, buttonSeparator, buttonBackground, buttonHoverBackground, buttonSecondaryForeground, buttonSecondaryBackground, buttonSecondaryHoverBackground, buttonBorder, progressBarBackground, inputActiveOptionBorder, inputActiveOptionForeground, inputActiveOptionBackground, editorWidgetBackground, editorWidgetForeground, contrastBorder, checkboxBorder, checkboxBackground, checkboxForeground, problemsErrorIconForeground, problemsWarningIconForeground, problemsInfoIconForeground, inputBackground, inputForeground, inputBorder, textLinkForeground, inputValidationInfoBorder, inputValidationInfoBackground, inputValidationInfoForeground, inputValidationWarningBorder, inputValidationWarningBackground, inputValidationWarningForeground, inputValidationErrorBorder, inputValidationErrorBackground, inputValidationErrorForeground, listFilterWidgetBackground, listFilterWidgetNoMatchesOutline, listFilterWidgetOutline, listFilterWidgetShadow, badgeBackground, badgeForeground, breadcrumbsBackground, breadcrumbsForeground, breadcrumbsFocusForeground, breadcrumbsActiveSelectionForeground, activeContrastBorder, listActiveSelectionBackground, listActiveSelectionForeground, listActiveSelectionIconForeground, listDropBackground, listFocusAndSelectionOutline, listFocusBackground, listFocusForeground, listFocusOutline, listHoverBackground, listHoverForeground, listInactiveFocusBackground, listInactiveFocusOutline, listInactiveSelectionBackground, listInactiveSelectionForeground, listInactiveSelectionIconForeground, tableColumnsBorder, tableOddRowsBackgroundColor, treeIndentGuidesStroke, asCssVariableWithDefault, editorWidgetBorder, focusBorder, pickerGroupForeground, quickInputListFocusBackground, quickInputListFocusForeground, quickInputListFocusIconForeground, selectBackground, selectBorder, selectForeground, selectListBackground, treeInactiveIndentGuidesStroke, menuBorder, menuForeground, menuBackground, menuSelectionForeground, menuSelectionBackground, menuSelectionBorder, menuSeparatorBackground, scrollbarShadow, scrollbarSliderActiveBackground, scrollbarSliderBackground, scrollbarSliderHoverBackground } from '../common/colorRegistry.js';
import { Color } from '../../../base/common/color.js';
export const defaultKeybindingLabelStyles = getKeybindingLabelStyles({});
export function getKeybindingLabelStyles(override) {
    var _a, _b, _c, _d, _e;
    return {
        keybindingLabelBackground: asCssVariable((_a = override.keybindingLabelBackground) !== null && _a !== void 0 ? _a : keybindingLabelBackground),
        keybindingLabelForeground: asCssVariable((_b = override.keybindingLabelForeground) !== null && _b !== void 0 ? _b : keybindingLabelForeground),
        keybindingLabelBorder: asCssVariable((_c = override.keybindingLabelBorder) !== null && _c !== void 0 ? _c : keybindingLabelBorder),
        keybindingLabelBottomBorder: asCssVariable((_d = override.keybindingLabelBottomBorder) !== null && _d !== void 0 ? _d : keybindingLabelBottomBorder),
        keybindingLabelShadow: asCssVariable((_e = override.keybindingLabelShadow) !== null && _e !== void 0 ? _e : widgetShadow)
    };
}
export const defaultButtonStyles = getButtonStyles({});
export function getButtonStyles(override) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        buttonForeground: asCssVariable((_a = override.buttonForeground) !== null && _a !== void 0 ? _a : buttonForeground),
        buttonSeparator: asCssVariable((_b = override.buttonSeparator) !== null && _b !== void 0 ? _b : buttonSeparator),
        buttonBackground: asCssVariable((_c = override.buttonBackground) !== null && _c !== void 0 ? _c : buttonBackground),
        buttonHoverBackground: asCssVariable((_d = override.buttonHoverBackground) !== null && _d !== void 0 ? _d : buttonHoverBackground),
        buttonSecondaryForeground: asCssVariable((_e = override.buttonSecondaryForeground) !== null && _e !== void 0 ? _e : buttonSecondaryForeground),
        buttonSecondaryBackground: asCssVariable((_f = override.buttonSecondaryBackground) !== null && _f !== void 0 ? _f : buttonSecondaryBackground),
        buttonSecondaryHoverBackground: asCssVariable((_g = override.buttonSecondaryHoverBackground) !== null && _g !== void 0 ? _g : buttonSecondaryHoverBackground),
        buttonBorder: asCssVariable((_h = override.buttonBorder) !== null && _h !== void 0 ? _h : buttonBorder),
    };
}
export const defaultProgressBarStyles = getProgressBarStyles({});
export function getProgressBarStyles(override) {
    var _a;
    return {
        progressBarBackground: asCssVariable((_a = override.progressBarBackground) !== null && _a !== void 0 ? _a : progressBarBackground)
    };
}
export const defaultToggleStyles = getToggleStyles({});
export function getToggleStyles(override) {
    var _a, _b, _c;
    return {
        inputActiveOptionBorder: asCssVariable((_a = override.inputActiveOptionBorder) !== null && _a !== void 0 ? _a : inputActiveOptionBorder),
        inputActiveOptionForeground: asCssVariable((_b = override.inputActiveOptionForeground) !== null && _b !== void 0 ? _b : inputActiveOptionForeground),
        inputActiveOptionBackground: asCssVariable((_c = override.inputActiveOptionBackground) !== null && _c !== void 0 ? _c : inputActiveOptionBackground)
    };
}
export const defaultCheckboxStyles = getCheckboxStyles({});
export function getCheckboxStyles(override) {
    var _a, _b, _c;
    return {
        checkboxBackground: asCssVariable((_a = override.checkboxBackground) !== null && _a !== void 0 ? _a : checkboxBackground),
        checkboxBorder: asCssVariable((_b = override.checkboxBorder) !== null && _b !== void 0 ? _b : checkboxBorder),
        checkboxForeground: asCssVariable((_c = override.checkboxForeground) !== null && _c !== void 0 ? _c : checkboxForeground)
    };
}
export const defaultDialogStyles = getDialogStyle({});
export function getDialogStyle(override) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        dialogBackground: asCssVariable((_a = override.dialogBackground) !== null && _a !== void 0 ? _a : editorWidgetBackground),
        dialogForeground: asCssVariable((_b = override.dialogForeground) !== null && _b !== void 0 ? _b : editorWidgetForeground),
        dialogShadow: asCssVariable((_c = override.dialogShadow) !== null && _c !== void 0 ? _c : widgetShadow),
        dialogBorder: asCssVariable((_d = override.dialogBorder) !== null && _d !== void 0 ? _d : contrastBorder),
        errorIconForeground: asCssVariable((_e = override.errorIconForeground) !== null && _e !== void 0 ? _e : problemsErrorIconForeground),
        warningIconForeground: asCssVariable((_f = override.warningIconForeground) !== null && _f !== void 0 ? _f : problemsWarningIconForeground),
        infoIconForeground: asCssVariable((_g = override.infoIconForeground) !== null && _g !== void 0 ? _g : problemsInfoIconForeground),
        textLinkForeground: asCssVariable((_h = override.textLinkForeground) !== null && _h !== void 0 ? _h : textLinkForeground)
    };
}
export const defaultInputBoxStyles = getInputBoxStyle({});
export function getInputBoxStyle(override) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return {
        inputBackground: asCssVariable((_a = override.inputBackground) !== null && _a !== void 0 ? _a : inputBackground),
        inputForeground: asCssVariable((_b = override.inputForeground) !== null && _b !== void 0 ? _b : inputForeground),
        inputBorder: asCssVariable((_c = override.inputBorder) !== null && _c !== void 0 ? _c : inputBorder),
        inputValidationInfoBorder: asCssVariable((_d = override.inputValidationInfoBorder) !== null && _d !== void 0 ? _d : inputValidationInfoBorder),
        inputValidationInfoBackground: asCssVariable((_e = override.inputValidationInfoBackground) !== null && _e !== void 0 ? _e : inputValidationInfoBackground),
        inputValidationInfoForeground: asCssVariable((_f = override.inputValidationInfoForeground) !== null && _f !== void 0 ? _f : inputValidationInfoForeground),
        inputValidationWarningBorder: asCssVariable((_g = override.inputValidationWarningBorder) !== null && _g !== void 0 ? _g : inputValidationWarningBorder),
        inputValidationWarningBackground: asCssVariable((_h = override.inputValidationWarningBackground) !== null && _h !== void 0 ? _h : inputValidationWarningBackground),
        inputValidationWarningForeground: asCssVariable((_j = override.inputValidationWarningForeground) !== null && _j !== void 0 ? _j : inputValidationWarningForeground),
        inputValidationErrorBorder: asCssVariable((_k = override.inputValidationErrorBorder) !== null && _k !== void 0 ? _k : inputValidationErrorBorder),
        inputValidationErrorBackground: asCssVariable((_l = override.inputValidationErrorBackground) !== null && _l !== void 0 ? _l : inputValidationErrorBackground),
        inputValidationErrorForeground: asCssVariable((_m = override.inputValidationErrorForeground) !== null && _m !== void 0 ? _m : inputValidationErrorForeground)
    };
}
export const defaultFindWidgetStyles = {
    listFilterWidgetBackground: asCssVariable(listFilterWidgetBackground),
    listFilterWidgetOutline: asCssVariable(listFilterWidgetOutline),
    listFilterWidgetNoMatchesOutline: asCssVariable(listFilterWidgetNoMatchesOutline),
    listFilterWidgetShadow: asCssVariable(listFilterWidgetShadow),
    inputBoxStyles: defaultInputBoxStyles,
    toggleStyles: defaultToggleStyles
};
export const defaultCountBadgeStyles = getCountBadgeStyle({});
export function getCountBadgeStyle(override) {
    var _a, _b;
    return {
        badgeBackground: asCssVariable((_a = override.badgeBackground) !== null && _a !== void 0 ? _a : badgeBackground),
        badgeForeground: asCssVariable((_b = override.badgeForeground) !== null && _b !== void 0 ? _b : badgeForeground),
        badgeBorder: asCssVariable(contrastBorder)
    };
}
export const defaultBreadcrumbsWidgetStyles = getBreadcrumbsWidgetStyles({});
export function getBreadcrumbsWidgetStyles(override) {
    var _a, _b, _c, _d, _e;
    return {
        breadcrumbsBackground: asCssVariable((_a = override.breadcrumbsBackground) !== null && _a !== void 0 ? _a : breadcrumbsBackground),
        breadcrumbsForeground: asCssVariable((_b = override.breadcrumbsForeground) !== null && _b !== void 0 ? _b : breadcrumbsForeground),
        breadcrumbsHoverForeground: asCssVariable((_c = override.breadcrumbsFocusForeground) !== null && _c !== void 0 ? _c : breadcrumbsFocusForeground),
        breadcrumbsFocusForeground: asCssVariable((_d = override.breadcrumbsFocusForeground) !== null && _d !== void 0 ? _d : breadcrumbsFocusForeground),
        breadcrumbsFocusAndSelectionForeground: asCssVariable((_e = override.breadcrumbsFocusAndSelectionForeground) !== null && _e !== void 0 ? _e : breadcrumbsActiveSelectionForeground)
    };
}
export const defaultListStyles = getListStyles({});
export function getListStyles(override) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    return {
        listBackground: override.listBackground ? asCssVariable(override.listBackground) : undefined,
        listInactiveFocusForeground: override.listInactiveFocusForeground ? asCssVariable(override.listInactiveFocusForeground) : undefined,
        listFocusBackground: asCssVariable((_a = override.listFocusBackground) !== null && _a !== void 0 ? _a : listFocusBackground),
        listFocusForeground: asCssVariable((_b = override.listFocusForeground) !== null && _b !== void 0 ? _b : listFocusForeground),
        listFocusOutline: asCssVariable((_c = override.listFocusOutline) !== null && _c !== void 0 ? _c : listFocusOutline),
        listActiveSelectionBackground: asCssVariable((_d = override.listActiveSelectionBackground) !== null && _d !== void 0 ? _d : listActiveSelectionBackground),
        listActiveSelectionForeground: asCssVariable((_e = override.listActiveSelectionForeground) !== null && _e !== void 0 ? _e : listActiveSelectionForeground),
        listActiveSelectionIconForeground: asCssVariable((_f = override.listActiveSelectionIconForeground) !== null && _f !== void 0 ? _f : listActiveSelectionIconForeground),
        listFocusAndSelectionOutline: asCssVariable((_g = override.listFocusAndSelectionOutline) !== null && _g !== void 0 ? _g : listFocusAndSelectionOutline),
        listFocusAndSelectionBackground: asCssVariable((_h = override.listFocusAndSelectionBackground) !== null && _h !== void 0 ? _h : listActiveSelectionBackground),
        listFocusAndSelectionForeground: asCssVariable((_j = override.listFocusAndSelectionForeground) !== null && _j !== void 0 ? _j : listActiveSelectionForeground),
        listInactiveSelectionBackground: asCssVariable((_k = override.listInactiveSelectionBackground) !== null && _k !== void 0 ? _k : listInactiveSelectionBackground),
        listInactiveSelectionIconForeground: asCssVariable((_l = override.listInactiveSelectionIconForeground) !== null && _l !== void 0 ? _l : listInactiveSelectionIconForeground),
        listInactiveSelectionForeground: asCssVariable((_m = override.listInactiveSelectionForeground) !== null && _m !== void 0 ? _m : listInactiveSelectionForeground),
        listInactiveFocusBackground: asCssVariable((_o = override.listInactiveFocusBackground) !== null && _o !== void 0 ? _o : listInactiveFocusBackground),
        listInactiveFocusOutline: asCssVariable((_p = override.listInactiveFocusOutline) !== null && _p !== void 0 ? _p : listInactiveFocusOutline),
        listHoverBackground: asCssVariable((_q = override.listHoverBackground) !== null && _q !== void 0 ? _q : listHoverBackground),
        listHoverForeground: asCssVariable((_r = override.listHoverForeground) !== null && _r !== void 0 ? _r : listHoverForeground),
        listDropBackground: asCssVariable((_s = override.listDropBackground) !== null && _s !== void 0 ? _s : listDropBackground),
        listSelectionOutline: asCssVariable((_t = override.listSelectionOutline) !== null && _t !== void 0 ? _t : activeContrastBorder),
        listHoverOutline: asCssVariable((_u = override.listHoverOutline) !== null && _u !== void 0 ? _u : activeContrastBorder),
        treeIndentGuidesStroke: asCssVariable((_v = override.treeIndentGuidesStroke) !== null && _v !== void 0 ? _v : treeIndentGuidesStroke),
        treeInactiveIndentGuidesStroke: asCssVariable((_w = override.treeInactiveIndentGuidesStroke) !== null && _w !== void 0 ? _w : treeInactiveIndentGuidesStroke),
        tableColumnsBorder: asCssVariable((_x = override.tableColumnsBorder) !== null && _x !== void 0 ? _x : tableColumnsBorder),
        tableOddRowsBackgroundColor: asCssVariable((_y = override.tableOddRowsBackgroundColor) !== null && _y !== void 0 ? _y : tableOddRowsBackgroundColor),
    };
}
export const defaultSelectBoxStyles = getSelectBoxStyles({});
export function getSelectBoxStyles(override) {
    var _a;
    return {
        selectBackground: asCssVariable(override.selectBackground || selectBackground),
        selectListBackground: asCssVariable(override.selectListBackground || selectListBackground),
        selectForeground: asCssVariable(override.selectForeground || selectForeground),
        decoratorRightForeground: asCssVariable(override.decoratorRightForeground || pickerGroupForeground),
        selectBorder: asCssVariable(override.selectBorder || selectBorder),
        focusBorder: asCssVariable(override.focusBorder || focusBorder),
        listFocusBackground: asCssVariable(override.listFocusBackground || quickInputListFocusBackground),
        listInactiveSelectionIconForeground: asCssVariable(override.listInactiveSelectionIconForeground || quickInputListFocusIconForeground),
        listFocusForeground: asCssVariable(override.listFocusForeground || quickInputListFocusForeground),
        listFocusOutline: asCssVariableWithDefault((_a = override.listFocusOutline) !== null && _a !== void 0 ? _a : activeContrastBorder, Color.transparent.toString()),
        listHoverBackground: asCssVariable(override.listHoverBackground || listHoverBackground),
        listHoverForeground: asCssVariable(override.listHoverForeground || listHoverForeground),
        listHoverOutline: asCssVariable(override.listFocusOutline || activeContrastBorder),
        selectListBorder: asCssVariable(override.selectListBorder || editorWidgetBorder),
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
}
export const defaultMenuStyles = getMenuStyles({});
export function getMenuStyles(override) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return {
        shadowColor: asCssVariable((_a = override.shadowColor) !== null && _a !== void 0 ? _a : widgetShadow),
        borderColor: asCssVariable((_b = override.borderColor) !== null && _b !== void 0 ? _b : menuBorder),
        foregroundColor: asCssVariable((_c = override.foregroundColor) !== null && _c !== void 0 ? _c : menuForeground),
        backgroundColor: asCssVariable((_d = override.backgroundColor) !== null && _d !== void 0 ? _d : menuBackground),
        selectionForegroundColor: asCssVariable((_e = override.selectionForegroundColor) !== null && _e !== void 0 ? _e : menuSelectionForeground),
        selectionBackgroundColor: asCssVariable((_f = override.selectionBackgroundColor) !== null && _f !== void 0 ? _f : menuSelectionBackground),
        selectionBorderColor: asCssVariable((_g = override.selectionBorderColor) !== null && _g !== void 0 ? _g : menuSelectionBorder),
        separatorColor: asCssVariable((_h = override.separatorColor) !== null && _h !== void 0 ? _h : menuSeparatorBackground),
        scrollbarShadow: asCssVariable((_j = override.scrollbarShadow) !== null && _j !== void 0 ? _j : scrollbarShadow),
        scrollbarSliderBackground: asCssVariable((_k = override.scrollbarSliderBackground) !== null && _k !== void 0 ? _k : scrollbarSliderBackground),
        scrollbarSliderHoverBackground: asCssVariable((_l = override.scrollbarSliderHoverBackground) !== null && _l !== void 0 ? _l : scrollbarSliderHoverBackground),
        scrollbarSliderActiveBackground: asCssVariable((_m = override.scrollbarSliderActiveBackground) !== null && _m !== void 0 ? _m : scrollbarSliderActiveBackground)
    };
}
