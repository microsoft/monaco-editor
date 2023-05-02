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
import { onUnexpectedExternalError } from '../../../../base/common/errors.js';
export class CodeActionKind {
    constructor(value) {
        this.value = value;
    }
    equals(other) {
        return this.value === other.value;
    }
    contains(other) {
        return this.equals(other) || this.value === '' || other.value.startsWith(this.value + CodeActionKind.sep);
    }
    intersects(other) {
        return this.contains(other) || other.contains(this);
    }
    append(part) {
        return new CodeActionKind(this.value + CodeActionKind.sep + part);
    }
}
CodeActionKind.sep = '.';
CodeActionKind.None = new CodeActionKind('@@none@@'); // Special code action that contains nothing
CodeActionKind.Empty = new CodeActionKind('');
CodeActionKind.QuickFix = new CodeActionKind('quickfix');
CodeActionKind.Refactor = new CodeActionKind('refactor');
CodeActionKind.RefactorExtract = CodeActionKind.Refactor.append('extract');
CodeActionKind.RefactorInline = CodeActionKind.Refactor.append('inline');
CodeActionKind.RefactorMove = CodeActionKind.Refactor.append('move');
CodeActionKind.RefactorRewrite = CodeActionKind.Refactor.append('rewrite');
CodeActionKind.Source = new CodeActionKind('source');
CodeActionKind.SourceOrganizeImports = CodeActionKind.Source.append('organizeImports');
CodeActionKind.SourceFixAll = CodeActionKind.Source.append('fixAll');
CodeActionKind.SurroundWith = CodeActionKind.Refactor.append('surround');
export var CodeActionTriggerSource;
(function (CodeActionTriggerSource) {
    CodeActionTriggerSource["Refactor"] = "refactor";
    CodeActionTriggerSource["RefactorPreview"] = "refactor preview";
    CodeActionTriggerSource["Lightbulb"] = "lightbulb";
    CodeActionTriggerSource["Default"] = "other (default)";
    CodeActionTriggerSource["SourceAction"] = "source action";
    CodeActionTriggerSource["QuickFix"] = "quick fix action";
    CodeActionTriggerSource["FixAll"] = "fix all";
    CodeActionTriggerSource["OrganizeImports"] = "organize imports";
    CodeActionTriggerSource["AutoFix"] = "auto fix";
    CodeActionTriggerSource["QuickFixHover"] = "quick fix hover window";
    CodeActionTriggerSource["OnSave"] = "save participants";
    CodeActionTriggerSource["ProblemsView"] = "problems view";
})(CodeActionTriggerSource || (CodeActionTriggerSource = {}));
export function mayIncludeActionsOfKind(filter, providedKind) {
    // A provided kind may be a subset or superset of our filtered kind.
    if (filter.include && !filter.include.intersects(providedKind)) {
        return false;
    }
    if (filter.excludes) {
        if (filter.excludes.some(exclude => excludesAction(providedKind, exclude, filter.include))) {
            return false;
        }
    }
    // Don't return source actions unless they are explicitly requested
    if (!filter.includeSourceActions && CodeActionKind.Source.contains(providedKind)) {
        return false;
    }
    return true;
}
export function filtersAction(filter, action) {
    const actionKind = action.kind ? new CodeActionKind(action.kind) : undefined;
    // Filter out actions by kind
    if (filter.include) {
        if (!actionKind || !filter.include.contains(actionKind)) {
            return false;
        }
    }
    if (filter.excludes) {
        if (actionKind && filter.excludes.some(exclude => excludesAction(actionKind, exclude, filter.include))) {
            return false;
        }
    }
    // Don't return source actions unless they are explicitly requested
    if (!filter.includeSourceActions) {
        if (actionKind && CodeActionKind.Source.contains(actionKind)) {
            return false;
        }
    }
    if (filter.onlyIncludePreferredActions) {
        if (!action.isPreferred) {
            return false;
        }
    }
    return true;
}
function excludesAction(providedKind, exclude, include) {
    if (!exclude.contains(providedKind)) {
        return false;
    }
    if (include && exclude.contains(include)) {
        // The include is more specific, don't filter out
        return false;
    }
    return true;
}
export class CodeActionCommandArgs {
    static fromUser(arg, defaults) {
        if (!arg || typeof arg !== 'object') {
            return new CodeActionCommandArgs(defaults.kind, defaults.apply, false);
        }
        return new CodeActionCommandArgs(CodeActionCommandArgs.getKindFromUser(arg, defaults.kind), CodeActionCommandArgs.getApplyFromUser(arg, defaults.apply), CodeActionCommandArgs.getPreferredUser(arg));
    }
    static getApplyFromUser(arg, defaultAutoApply) {
        switch (typeof arg.apply === 'string' ? arg.apply.toLowerCase() : '') {
            case 'first': return "first" /* CodeActionAutoApply.First */;
            case 'never': return "never" /* CodeActionAutoApply.Never */;
            case 'ifsingle': return "ifSingle" /* CodeActionAutoApply.IfSingle */;
            default: return defaultAutoApply;
        }
    }
    static getKindFromUser(arg, defaultKind) {
        return typeof arg.kind === 'string'
            ? new CodeActionKind(arg.kind)
            : defaultKind;
    }
    static getPreferredUser(arg) {
        return typeof arg.preferred === 'boolean'
            ? arg.preferred
            : false;
    }
    constructor(kind, apply, preferred) {
        this.kind = kind;
        this.apply = apply;
        this.preferred = preferred;
    }
}
export class CodeActionItem {
    constructor(action, provider) {
        this.action = action;
        this.provider = provider;
    }
    resolve(token) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (((_a = this.provider) === null || _a === void 0 ? void 0 : _a.resolveCodeAction) && !this.action.edit) {
                let action;
                try {
                    action = yield this.provider.resolveCodeAction(this.action, token);
                }
                catch (err) {
                    onUnexpectedExternalError(err);
                }
                if (action) {
                    this.action.edit = action.edit;
                }
            }
            return this;
        });
    }
}
