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
import { equals } from '../../../../base/common/arrays.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { LRUCache } from '../../../../base/common/map.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IModelService } from '../../../common/services/model.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
export class TreeElement {
    remove() {
        var _a;
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.children.delete(this.id);
    }
    static findId(candidate, container) {
        // complex id-computation which contains the origin/extension,
        // the parent path, and some dedupe logic when names collide
        let candidateId;
        if (typeof candidate === 'string') {
            candidateId = `${container.id}/${candidate}`;
        }
        else {
            candidateId = `${container.id}/${candidate.name}`;
            if (container.children.get(candidateId) !== undefined) {
                candidateId = `${container.id}/${candidate.name}_${candidate.range.startLineNumber}_${candidate.range.startColumn}`;
            }
        }
        let id = candidateId;
        for (let i = 0; container.children.get(id) !== undefined; i++) {
            id = `${candidateId}_${i}`;
        }
        return id;
    }
    static empty(element) {
        return element.children.size === 0;
    }
}
export class OutlineElement extends TreeElement {
    constructor(id, parent, symbol) {
        super();
        this.id = id;
        this.parent = parent;
        this.symbol = symbol;
        this.children = new Map();
    }
}
export class OutlineGroup extends TreeElement {
    constructor(id, parent, label, order) {
        super();
        this.id = id;
        this.parent = parent;
        this.label = label;
        this.order = order;
        this.children = new Map();
    }
}
export class OutlineModel extends TreeElement {
    static create(registry, textModel, token) {
        const cts = new CancellationTokenSource(token);
        const result = new OutlineModel(textModel.uri);
        const provider = registry.ordered(textModel);
        const promises = provider.map((provider, index) => {
            var _a;
            const id = TreeElement.findId(`provider_${index}`, result);
            const group = new OutlineGroup(id, result, (_a = provider.displayName) !== null && _a !== void 0 ? _a : 'Unknown Outline Provider', index);
            return Promise.resolve(provider.provideDocumentSymbols(textModel, cts.token)).then(result => {
                for (const info of result || []) {
                    OutlineModel._makeOutlineElement(info, group);
                }
                return group;
            }, err => {
                onUnexpectedExternalError(err);
                return group;
            }).then(group => {
                if (!TreeElement.empty(group)) {
                    result._groups.set(id, group);
                }
                else {
                    group.remove();
                }
            });
        });
        const listener = registry.onDidChange(() => {
            const newProvider = registry.ordered(textModel);
            if (!equals(newProvider, provider)) {
                cts.cancel();
            }
        });
        return Promise.all(promises).then(() => {
            if (cts.token.isCancellationRequested && !token.isCancellationRequested) {
                return OutlineModel.create(registry, textModel, token);
            }
            else {
                return result._compact();
            }
        }).finally(() => {
            listener.dispose();
        });
    }
    static _makeOutlineElement(info, container) {
        const id = TreeElement.findId(info, container);
        const res = new OutlineElement(id, container, info);
        if (info.children) {
            for (const childInfo of info.children) {
                OutlineModel._makeOutlineElement(childInfo, res);
            }
        }
        container.children.set(res.id, res);
    }
    constructor(uri) {
        super();
        this.uri = uri;
        this.id = 'root';
        this.parent = undefined;
        this._groups = new Map();
        this.children = new Map();
        this.id = 'root';
        this.parent = undefined;
    }
    _compact() {
        let count = 0;
        for (const [key, group] of this._groups) {
            if (group.children.size === 0) { // empty
                this._groups.delete(key);
            }
            else {
                count += 1;
            }
        }
        if (count !== 1) {
            //
            this.children = this._groups;
        }
        else {
            // adopt all elements of the first group
            const group = Iterable.first(this._groups.values());
            for (const [, child] of group.children) {
                child.parent = this;
                this.children.set(child.id, child);
            }
        }
        return this;
    }
    getTopLevelSymbols() {
        const roots = [];
        for (const child of this.children.values()) {
            if (child instanceof OutlineElement) {
                roots.push(child.symbol);
            }
            else {
                roots.push(...Iterable.map(child.children.values(), child => child.symbol));
            }
        }
        return roots.sort((a, b) => Range.compareRangesUsingStarts(a.range, b.range));
    }
    asListOfDocumentSymbols() {
        const roots = this.getTopLevelSymbols();
        const bucket = [];
        OutlineModel._flattenDocumentSymbols(bucket, roots, '');
        return bucket.sort((a, b) => Position.compare(Range.getStartPosition(a.range), Range.getStartPosition(b.range)) || Position.compare(Range.getEndPosition(b.range), Range.getEndPosition(a.range)));
    }
    static _flattenDocumentSymbols(bucket, entries, overrideContainerLabel) {
        for (const entry of entries) {
            bucket.push({
                kind: entry.kind,
                tags: entry.tags,
                name: entry.name,
                detail: entry.detail,
                containerName: entry.containerName || overrideContainerLabel,
                range: entry.range,
                selectionRange: entry.selectionRange,
                children: undefined, // we flatten it...
            });
            // Recurse over children
            if (entry.children) {
                OutlineModel._flattenDocumentSymbols(bucket, entry.children, entry.name);
            }
        }
    }
}
export const IOutlineModelService = createDecorator('IOutlineModelService');
let OutlineModelService = class OutlineModelService {
    constructor(_languageFeaturesService, debounces, modelService) {
        this._languageFeaturesService = _languageFeaturesService;
        this._disposables = new DisposableStore();
        this._cache = new LRUCache(10, 0.7);
        this._debounceInformation = debounces.for(_languageFeaturesService.documentSymbolProvider, 'DocumentSymbols', { min: 350 });
        // don't cache outline models longer than their text model
        this._disposables.add(modelService.onModelRemoved(textModel => {
            this._cache.delete(textModel.id);
        }));
    }
    dispose() {
        this._disposables.dispose();
    }
    getOrCreate(textModel, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const registry = this._languageFeaturesService.documentSymbolProvider;
            const provider = registry.ordered(textModel);
            let data = this._cache.get(textModel.id);
            if (!data || data.versionId !== textModel.getVersionId() || !equals(data.provider, provider)) {
                const source = new CancellationTokenSource();
                data = {
                    versionId: textModel.getVersionId(),
                    provider,
                    promiseCnt: 0,
                    source,
                    promise: OutlineModel.create(registry, textModel, source.token),
                    model: undefined,
                };
                this._cache.set(textModel.id, data);
                const now = Date.now();
                data.promise.then(outlineModel => {
                    data.model = outlineModel;
                    this._debounceInformation.update(textModel, Date.now() - now);
                }).catch(_err => {
                    this._cache.delete(textModel.id);
                });
            }
            if (data.model) {
                // resolved -> return data
                return data.model;
            }
            // increase usage counter
            data.promiseCnt += 1;
            const listener = token.onCancellationRequested(() => {
                // last -> cancel provider request, remove cached promise
                if (--data.promiseCnt === 0) {
                    data.source.cancel();
                    this._cache.delete(textModel.id);
                }
            });
            try {
                return yield data.promise;
            }
            finally {
                listener.dispose();
            }
        });
    }
};
OutlineModelService = __decorate([
    __param(0, ILanguageFeaturesService),
    __param(1, ILanguageFeatureDebounceService),
    __param(2, IModelService)
], OutlineModelService);
export { OutlineModelService };
registerSingleton(IOutlineModelService, OutlineModelService, 1 /* InstantiationType.Delayed */);
