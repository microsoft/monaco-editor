/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { VSBuffer } from './buffer.js';
import { URI } from './uri.js';
export function parse(text) {
    let data = JSON.parse(text);
    data = revive(data);
    return data;
}
export function revive(obj, depth = 0) {
    if (!obj || depth > 200) {
        return obj;
    }
    if (typeof obj === 'object') {
        switch (obj.$mid) {
            case 1 /* MarshalledId.Uri */: return URI.revive(obj);
            case 2 /* MarshalledId.Regexp */: return new RegExp(obj.source, obj.flags);
            case 16 /* MarshalledId.Date */: return new Date(obj.source);
        }
        if (obj instanceof VSBuffer
            || obj instanceof Uint8Array) {
            return obj;
        }
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; ++i) {
                obj[i] = revive(obj[i], depth + 1);
            }
        }
        else {
            // walk object
            for (const key in obj) {
                if (Object.hasOwnProperty.call(obj, key)) {
                    obj[key] = revive(obj[key], depth + 1);
                }
            }
        }
    }
    return obj;
}
