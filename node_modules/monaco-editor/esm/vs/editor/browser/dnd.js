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
import { DataTransfers } from '../../base/browser/dnd.js';
import { createFileDataTransferItem, createStringDataTransferItem, UriList, VSDataTransfer } from '../../base/common/dataTransfer.js';
import { Mimes } from '../../base/common/mime.js';
import { URI } from '../../base/common/uri.js';
import { CodeDataTransfers, extractEditorsDropData } from '../../platform/dnd/browser/dnd.js';
export function toVSDataTransfer(dataTransfer) {
    const vsDataTransfer = new VSDataTransfer();
    for (const item of dataTransfer.items) {
        const type = item.type;
        if (item.kind === 'string') {
            const asStringValue = new Promise(resolve => item.getAsString(resolve));
            vsDataTransfer.append(type, createStringDataTransferItem(asStringValue));
        }
        else if (item.kind === 'file') {
            const file = item.getAsFile();
            if (file) {
                vsDataTransfer.append(type, createFileDataTransferItemFromFile(file));
            }
        }
    }
    return vsDataTransfer;
}
function createFileDataTransferItemFromFile(file) {
    const uri = file.path ? URI.parse(file.path) : undefined;
    return createFileDataTransferItem(file.name, uri, () => __awaiter(this, void 0, void 0, function* () {
        return new Uint8Array(yield file.arrayBuffer());
    }));
}
const INTERNAL_DND_MIME_TYPES = Object.freeze([
    CodeDataTransfers.EDITORS,
    CodeDataTransfers.FILES,
    DataTransfers.RESOURCES,
]);
export function addExternalEditorsDropData(dataTransfer, dragEvent, overwriteUriList = false) {
    var _a;
    if (dragEvent.dataTransfer && (overwriteUriList || !dataTransfer.has(Mimes.uriList))) {
        const editorData = extractEditorsDropData(dragEvent)
            .filter(input => input.resource)
            .map(input => input.resource.toString());
        // Also add in the files
        for (const item of (_a = dragEvent.dataTransfer) === null || _a === void 0 ? void 0 : _a.items) {
            const file = item.getAsFile();
            if (file) {
                editorData.push(file.path ? URI.file(file.path).toString() : file.name);
            }
        }
        if (editorData.length) {
            dataTransfer.replace(Mimes.uriList, createStringDataTransferItem(UriList.create(editorData)));
        }
    }
    for (const internal of INTERNAL_DND_MIME_TYPES) {
        dataTransfer.delete(internal);
    }
}
