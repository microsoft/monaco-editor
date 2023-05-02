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
import { distinct } from './arrays.js';
import { Iterable } from './iterator.js';
import { generateUuid } from './uuid.js';
export function createStringDataTransferItem(stringOrPromise) {
    return {
        id: generateUuid(),
        asString: () => __awaiter(this, void 0, void 0, function* () { return stringOrPromise; }),
        asFile: () => undefined,
        value: typeof stringOrPromise === 'string' ? stringOrPromise : undefined,
    };
}
export function createFileDataTransferItem(fileName, uri, data) {
    return {
        id: generateUuid(),
        asString: () => __awaiter(this, void 0, void 0, function* () { return ''; }),
        asFile: () => ({ name: fileName, uri, data }),
        value: undefined,
    };
}
export class VSDataTransfer {
    constructor() {
        this._entries = new Map();
    }
    /**
     * Get the total number of entries in this data transfer.
     */
    get size() {
        let size = 0;
        this.forEach(() => size++);
        return size;
    }
    /**
     * Check if this data transfer contains data for `mimeType`.
     *
     * This uses exact matching and does not support wildcards.
     */
    has(mimeType) {
        return this._entries.has(this.toKey(mimeType));
    }
    /**
     * Check if this data transfer contains data matching `mimeTypeGlob`.
     *
     * This allows matching for wildcards, such as `image/*`.
     *
     * Use the special `files` mime type to match any file in the data transfer.
     */
    matches(mimeTypeGlob) {
        // Exact match
        if (this.has(mimeTypeGlob)) {
            return true;
        }
        // Special `files` mime type matches any file
        if (mimeTypeGlob.toLowerCase() === 'files') {
            return Iterable.some(this.values(), item => item.asFile());
        }
        // Anything glob
        if (mimeTypeGlob === '*/*') {
            return this._entries.size > 0;
        }
        // Wildcard, such as `image/*`
        const wildcard = this.toKey(mimeTypeGlob).match(/^([a-z]+)\/([a-z]+|\*)$/i);
        if (!wildcard) {
            return false;
        }
        const [_, type, subtype] = wildcard;
        if (subtype === '*') {
            return Iterable.some(this._entries.keys(), key => key.startsWith(type + '/'));
        }
        return false;
    }
    /**
     * Retrieve the first entry for `mimeType`.
     *
     * Note that if want to find all entries for a given mime type, use {@link VSDataTransfer.entries} instead.
     */
    get(mimeType) {
        var _a;
        return (_a = this._entries.get(this.toKey(mimeType))) === null || _a === void 0 ? void 0 : _a[0];
    }
    /**
     * Add a new entry to this data transfer.
     *
     * This does not replace existing entries for `mimeType`.
     */
    append(mimeType, value) {
        const existing = this._entries.get(mimeType);
        if (existing) {
            existing.push(value);
        }
        else {
            this._entries.set(this.toKey(mimeType), [value]);
        }
    }
    /**
     * Set the entry for a given mime type.
     *
     * This replaces all existing entries for `mimeType`.
     */
    replace(mimeType, value) {
        this._entries.set(this.toKey(mimeType), [value]);
    }
    /**
     * Remove all entries for `mimeType`.
     */
    delete(mimeType) {
        this._entries.delete(this.toKey(mimeType));
    }
    /**
     * Iterate over all `[mime, item]` pairs in this data transfer.
     *
     * There may be multiple entries for each mime type.
     */
    *entries() {
        for (const [mine, items] of this._entries.entries()) {
            for (const item of items) {
                yield [mine, item];
            }
        }
    }
    /**
     * Iterate over all items in this data transfer.
     *
     * There may be multiple entries for each mime type.
     */
    values() {
        return Array.from(this._entries.values()).flat();
    }
    /**
     * Call `f` for each item and mime in the data transfer.
     *
     * There may be multiple entries for each mime type.
     */
    forEach(f) {
        for (const [mime, item] of this.entries()) {
            f(item, mime);
        }
    }
    toKey(mimeType) {
        return mimeType.toLowerCase();
    }
}
export const UriList = Object.freeze({
    // http://amundsen.com/hypermedia/urilist/
    create: (entries) => {
        return distinct(entries.map(x => x.toString())).join('\r\n');
    },
    split: (str) => {
        return str.split('\r\n');
    },
    parse: (str) => {
        return UriList.split(str).filter(value => !value.startsWith('#'));
    }
});
