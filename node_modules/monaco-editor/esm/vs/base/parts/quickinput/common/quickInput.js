/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export const NO_KEY_MODS = { ctrlCmd: false, alt: false };
export var QuickInputHideReason;
(function (QuickInputHideReason) {
    /**
     * Focus moved away from the quick input.
     */
    QuickInputHideReason[QuickInputHideReason["Blur"] = 1] = "Blur";
    /**
     * An explicit user gesture, e.g. pressing Escape key.
     */
    QuickInputHideReason[QuickInputHideReason["Gesture"] = 2] = "Gesture";
    /**
     * Anything else.
     */
    QuickInputHideReason[QuickInputHideReason["Other"] = 3] = "Other";
})(QuickInputHideReason || (QuickInputHideReason = {}));
export var ItemActivation;
(function (ItemActivation) {
    ItemActivation[ItemActivation["NONE"] = 0] = "NONE";
    ItemActivation[ItemActivation["FIRST"] = 1] = "FIRST";
    ItemActivation[ItemActivation["SECOND"] = 2] = "SECOND";
    ItemActivation[ItemActivation["LAST"] = 3] = "LAST";
})(ItemActivation || (ItemActivation = {}));
export class QuickPickItemScorerAccessor {
    constructor(options) {
        this.options = options;
    }
}
export const quickPickItemScorerAccessor = new QuickPickItemScorerAccessor();
//#endregion
