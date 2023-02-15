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
import { normalizeDriveLetter } from '../../../../base/common/labels.js';
import * as path from '../../../../base/common/path.js';
import { dirname } from '../../../../base/common/resources.js';
import { commonPrefixLength, getLeadingWhitespace, isFalsyOrWhitespace, splitLines } from '../../../../base/common/strings.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { Text } from './snippetParser.js';
import * as nls from '../../../../nls.js';
import { WORKSPACE_EXTENSION, isSingleFolderWorkspaceIdentifier, toWorkspaceIdentifier, isEmptyWorkspaceIdentifier } from '../../../../platform/workspace/common/workspace.js';
export const KnownSnippetVariableNames = Object.freeze({
    'CURRENT_YEAR': true,
    'CURRENT_YEAR_SHORT': true,
    'CURRENT_MONTH': true,
    'CURRENT_DATE': true,
    'CURRENT_HOUR': true,
    'CURRENT_MINUTE': true,
    'CURRENT_SECOND': true,
    'CURRENT_DAY_NAME': true,
    'CURRENT_DAY_NAME_SHORT': true,
    'CURRENT_MONTH_NAME': true,
    'CURRENT_MONTH_NAME_SHORT': true,
    'CURRENT_SECONDS_UNIX': true,
    'SELECTION': true,
    'CLIPBOARD': true,
    'TM_SELECTED_TEXT': true,
    'TM_CURRENT_LINE': true,
    'TM_CURRENT_WORD': true,
    'TM_LINE_INDEX': true,
    'TM_LINE_NUMBER': true,
    'TM_FILENAME': true,
    'TM_FILENAME_BASE': true,
    'TM_DIRECTORY': true,
    'TM_FILEPATH': true,
    'CURSOR_INDEX': true,
    'CURSOR_NUMBER': true,
    'RELATIVE_FILEPATH': true,
    'BLOCK_COMMENT_START': true,
    'BLOCK_COMMENT_END': true,
    'LINE_COMMENT': true,
    'WORKSPACE_NAME': true,
    'WORKSPACE_FOLDER': true,
    'RANDOM': true,
    'RANDOM_HEX': true,
    'UUID': true
});
export class CompositeSnippetVariableResolver {
    constructor(_delegates) {
        this._delegates = _delegates;
        //
    }
    resolve(variable) {
        for (const delegate of this._delegates) {
            const value = delegate.resolve(variable);
            if (value !== undefined) {
                return value;
            }
        }
        return undefined;
    }
}
export class SelectionBasedVariableResolver {
    constructor(_model, _selection, _selectionIdx, _overtypingCapturer) {
        this._model = _model;
        this._selection = _selection;
        this._selectionIdx = _selectionIdx;
        this._overtypingCapturer = _overtypingCapturer;
        //
    }
    resolve(variable) {
        const { name } = variable;
        if (name === 'SELECTION' || name === 'TM_SELECTED_TEXT') {
            let value = this._model.getValueInRange(this._selection) || undefined;
            let isMultiline = this._selection.startLineNumber !== this._selection.endLineNumber;
            // If there was no selected text, try to get last overtyped text
            if (!value && this._overtypingCapturer) {
                const info = this._overtypingCapturer.getLastOvertypedInfo(this._selectionIdx);
                if (info) {
                    value = info.value;
                    isMultiline = info.multiline;
                }
            }
            if (value && isMultiline && variable.snippet) {
                // Selection is a multiline string which we indentation we now
                // need to adjust. We compare the indentation of this variable
                // with the indentation at the editor position and add potential
                // extra indentation to the value
                const line = this._model.getLineContent(this._selection.startLineNumber);
                const lineLeadingWhitespace = getLeadingWhitespace(line, 0, this._selection.startColumn - 1);
                let varLeadingWhitespace = lineLeadingWhitespace;
                variable.snippet.walk(marker => {
                    if (marker === variable) {
                        return false;
                    }
                    if (marker instanceof Text) {
                        varLeadingWhitespace = getLeadingWhitespace(splitLines(marker.value).pop());
                    }
                    return true;
                });
                const whitespaceCommonLength = commonPrefixLength(varLeadingWhitespace, lineLeadingWhitespace);
                value = value.replace(/(\r\n|\r|\n)(.*)/g, (m, newline, rest) => `${newline}${varLeadingWhitespace.substr(whitespaceCommonLength)}${rest}`);
            }
            return value;
        }
        else if (name === 'TM_CURRENT_LINE') {
            return this._model.getLineContent(this._selection.positionLineNumber);
        }
        else if (name === 'TM_CURRENT_WORD') {
            const info = this._model.getWordAtPosition({
                lineNumber: this._selection.positionLineNumber,
                column: this._selection.positionColumn
            });
            return info && info.word || undefined;
        }
        else if (name === 'TM_LINE_INDEX') {
            return String(this._selection.positionLineNumber - 1);
        }
        else if (name === 'TM_LINE_NUMBER') {
            return String(this._selection.positionLineNumber);
        }
        else if (name === 'CURSOR_INDEX') {
            return String(this._selectionIdx);
        }
        else if (name === 'CURSOR_NUMBER') {
            return String(this._selectionIdx + 1);
        }
        return undefined;
    }
}
export class ModelBasedVariableResolver {
    constructor(_labelService, _model) {
        this._labelService = _labelService;
        this._model = _model;
        //
    }
    resolve(variable) {
        const { name } = variable;
        if (name === 'TM_FILENAME') {
            return path.basename(this._model.uri.fsPath);
        }
        else if (name === 'TM_FILENAME_BASE') {
            const name = path.basename(this._model.uri.fsPath);
            const idx = name.lastIndexOf('.');
            if (idx <= 0) {
                return name;
            }
            else {
                return name.slice(0, idx);
            }
        }
        else if (name === 'TM_DIRECTORY') {
            if (path.dirname(this._model.uri.fsPath) === '.') {
                return '';
            }
            return this._labelService.getUriLabel(dirname(this._model.uri));
        }
        else if (name === 'TM_FILEPATH') {
            return this._labelService.getUriLabel(this._model.uri);
        }
        else if (name === 'RELATIVE_FILEPATH') {
            return this._labelService.getUriLabel(this._model.uri, { relative: true, noPrefix: true });
        }
        return undefined;
    }
}
export class ClipboardBasedVariableResolver {
    constructor(_readClipboardText, _selectionIdx, _selectionCount, _spread) {
        this._readClipboardText = _readClipboardText;
        this._selectionIdx = _selectionIdx;
        this._selectionCount = _selectionCount;
        this._spread = _spread;
        //
    }
    resolve(variable) {
        if (variable.name !== 'CLIPBOARD') {
            return undefined;
        }
        const clipboardText = this._readClipboardText();
        if (!clipboardText) {
            return undefined;
        }
        // `spread` is assigning each cursor a line of the clipboard
        // text whenever there the line count equals the cursor count
        // and when enabled
        if (this._spread) {
            const lines = clipboardText.split(/\r\n|\n|\r/).filter(s => !isFalsyOrWhitespace(s));
            if (lines.length === this._selectionCount) {
                return lines[this._selectionIdx];
            }
        }
        return clipboardText;
    }
}
let CommentBasedVariableResolver = class CommentBasedVariableResolver {
    constructor(_model, _selection, _languageConfigurationService) {
        this._model = _model;
        this._selection = _selection;
        this._languageConfigurationService = _languageConfigurationService;
        //
    }
    resolve(variable) {
        const { name } = variable;
        const langId = this._model.getLanguageIdAtPosition(this._selection.selectionStartLineNumber, this._selection.selectionStartColumn);
        const config = this._languageConfigurationService.getLanguageConfiguration(langId).comments;
        if (!config) {
            return undefined;
        }
        if (name === 'LINE_COMMENT') {
            return config.lineCommentToken || undefined;
        }
        else if (name === 'BLOCK_COMMENT_START') {
            return config.blockCommentStartToken || undefined;
        }
        else if (name === 'BLOCK_COMMENT_END') {
            return config.blockCommentEndToken || undefined;
        }
        return undefined;
    }
};
CommentBasedVariableResolver = __decorate([
    __param(2, ILanguageConfigurationService)
], CommentBasedVariableResolver);
export { CommentBasedVariableResolver };
class TimeBasedVariableResolver {
    constructor() {
        this._date = new Date();
    }
    resolve(variable) {
        const { name } = variable;
        if (name === 'CURRENT_YEAR') {
            return String(this._date.getFullYear());
        }
        else if (name === 'CURRENT_YEAR_SHORT') {
            return String(this._date.getFullYear()).slice(-2);
        }
        else if (name === 'CURRENT_MONTH') {
            return String(this._date.getMonth().valueOf() + 1).padStart(2, '0');
        }
        else if (name === 'CURRENT_DATE') {
            return String(this._date.getDate().valueOf()).padStart(2, '0');
        }
        else if (name === 'CURRENT_HOUR') {
            return String(this._date.getHours().valueOf()).padStart(2, '0');
        }
        else if (name === 'CURRENT_MINUTE') {
            return String(this._date.getMinutes().valueOf()).padStart(2, '0');
        }
        else if (name === 'CURRENT_SECOND') {
            return String(this._date.getSeconds().valueOf()).padStart(2, '0');
        }
        else if (name === 'CURRENT_DAY_NAME') {
            return TimeBasedVariableResolver.dayNames[this._date.getDay()];
        }
        else if (name === 'CURRENT_DAY_NAME_SHORT') {
            return TimeBasedVariableResolver.dayNamesShort[this._date.getDay()];
        }
        else if (name === 'CURRENT_MONTH_NAME') {
            return TimeBasedVariableResolver.monthNames[this._date.getMonth()];
        }
        else if (name === 'CURRENT_MONTH_NAME_SHORT') {
            return TimeBasedVariableResolver.monthNamesShort[this._date.getMonth()];
        }
        else if (name === 'CURRENT_SECONDS_UNIX') {
            return String(Math.floor(this._date.getTime() / 1000));
        }
        return undefined;
    }
}
TimeBasedVariableResolver.dayNames = [nls.localize('Sunday', "Sunday"), nls.localize('Monday', "Monday"), nls.localize('Tuesday', "Tuesday"), nls.localize('Wednesday', "Wednesday"), nls.localize('Thursday', "Thursday"), nls.localize('Friday', "Friday"), nls.localize('Saturday', "Saturday")];
TimeBasedVariableResolver.dayNamesShort = [nls.localize('SundayShort', "Sun"), nls.localize('MondayShort', "Mon"), nls.localize('TuesdayShort', "Tue"), nls.localize('WednesdayShort', "Wed"), nls.localize('ThursdayShort', "Thu"), nls.localize('FridayShort', "Fri"), nls.localize('SaturdayShort', "Sat")];
TimeBasedVariableResolver.monthNames = [nls.localize('January', "January"), nls.localize('February', "February"), nls.localize('March', "March"), nls.localize('April', "April"), nls.localize('May', "May"), nls.localize('June', "June"), nls.localize('July', "July"), nls.localize('August', "August"), nls.localize('September', "September"), nls.localize('October', "October"), nls.localize('November', "November"), nls.localize('December', "December")];
TimeBasedVariableResolver.monthNamesShort = [nls.localize('JanuaryShort', "Jan"), nls.localize('FebruaryShort', "Feb"), nls.localize('MarchShort', "Mar"), nls.localize('AprilShort', "Apr"), nls.localize('MayShort', "May"), nls.localize('JuneShort', "Jun"), nls.localize('JulyShort', "Jul"), nls.localize('AugustShort', "Aug"), nls.localize('SeptemberShort', "Sep"), nls.localize('OctoberShort', "Oct"), nls.localize('NovemberShort', "Nov"), nls.localize('DecemberShort', "Dec")];
export { TimeBasedVariableResolver };
export class WorkspaceBasedVariableResolver {
    constructor(_workspaceService) {
        this._workspaceService = _workspaceService;
        //
    }
    resolve(variable) {
        if (!this._workspaceService) {
            return undefined;
        }
        const workspaceIdentifier = toWorkspaceIdentifier(this._workspaceService.getWorkspace());
        if (isEmptyWorkspaceIdentifier(workspaceIdentifier)) {
            return undefined;
        }
        if (variable.name === 'WORKSPACE_NAME') {
            return this._resolveWorkspaceName(workspaceIdentifier);
        }
        else if (variable.name === 'WORKSPACE_FOLDER') {
            return this._resoveWorkspacePath(workspaceIdentifier);
        }
        return undefined;
    }
    _resolveWorkspaceName(workspaceIdentifier) {
        if (isSingleFolderWorkspaceIdentifier(workspaceIdentifier)) {
            return path.basename(workspaceIdentifier.uri.path);
        }
        let filename = path.basename(workspaceIdentifier.configPath.path);
        if (filename.endsWith(WORKSPACE_EXTENSION)) {
            filename = filename.substr(0, filename.length - WORKSPACE_EXTENSION.length - 1);
        }
        return filename;
    }
    _resoveWorkspacePath(workspaceIdentifier) {
        if (isSingleFolderWorkspaceIdentifier(workspaceIdentifier)) {
            return normalizeDriveLetter(workspaceIdentifier.uri.fsPath);
        }
        const filename = path.basename(workspaceIdentifier.configPath.path);
        let folderpath = workspaceIdentifier.configPath.fsPath;
        if (folderpath.endsWith(filename)) {
            folderpath = folderpath.substr(0, folderpath.length - filename.length - 1);
        }
        return (folderpath ? normalizeDriveLetter(folderpath) : '/');
    }
}
export class RandomBasedVariableResolver {
    resolve(variable) {
        const { name } = variable;
        if (name === 'RANDOM') {
            return Math.random().toString().slice(-6);
        }
        else if (name === 'RANDOM_HEX') {
            return Math.random().toString(16).slice(-6);
        }
        else if (name === 'UUID') {
            return generateUuid();
        }
        return undefined;
    }
}
