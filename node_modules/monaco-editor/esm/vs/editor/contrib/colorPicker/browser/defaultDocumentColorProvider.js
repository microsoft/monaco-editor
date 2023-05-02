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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Color, RGBA } from '../../../../base/common/color.js';
import { EditorWorkerClient } from '../../../browser/services/editorWorkerService.js';
import { IModelService } from '../../../common/services/model.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { registerEditorFeature } from '../../../common/editorFeatures.js';
export class DefaultDocumentColorProvider {
    constructor(modelService, languageConfigurationService) {
        this._editorWorkerClient = new EditorWorkerClient(modelService, false, 'editorWorkerService', languageConfigurationService);
    }
    provideDocumentColors(model, _token) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._editorWorkerClient.computeDefaultDocumentColors(model.uri);
        });
    }
    provideColorPresentations(_model, colorInfo, _token) {
        const range = colorInfo.range;
        const colorFromInfo = colorInfo.color;
        const alpha = colorFromInfo.alpha;
        const color = new Color(new RGBA(Math.round(255 * colorFromInfo.red), Math.round(255 * colorFromInfo.green), Math.round(255 * colorFromInfo.blue), alpha));
        const rgb = alpha ? Color.Format.CSS.formatRGB(color) : Color.Format.CSS.formatRGBA(color);
        const hsl = alpha ? Color.Format.CSS.formatHSL(color) : Color.Format.CSS.formatHSLA(color);
        const hex = alpha ? Color.Format.CSS.formatHex(color) : Color.Format.CSS.formatHexA(color);
        const colorPresentations = [];
        colorPresentations.push({ label: rgb, textEdit: { range: range, text: rgb } });
        colorPresentations.push({ label: hsl, textEdit: { range: range, text: hsl } });
        colorPresentations.push({ label: hex, textEdit: { range: range, text: hex } });
        return colorPresentations;
    }
}
let DefaultDocumentColorProviderFeature = class DefaultDocumentColorProviderFeature extends Disposable {
    constructor(_modelService, _languageConfigurationService, _languageFeaturesService) {
        super();
        this._register(_languageFeaturesService.colorProvider.register('*', new DefaultDocumentColorProvider(_modelService, _languageConfigurationService)));
    }
};
DefaultDocumentColorProviderFeature = __decorate([
    __param(0, IModelService),
    __param(1, ILanguageConfigurationService),
    __param(2, ILanguageFeaturesService)
], DefaultDocumentColorProviderFeature);
registerEditorFeature(DefaultDocumentColorProviderFeature);
