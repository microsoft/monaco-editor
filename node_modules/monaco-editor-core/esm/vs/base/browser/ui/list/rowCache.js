/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { $ } from '../../dom.js';
function removeFromParent(element) {
    var _a;
    try {
        (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(element);
    }
    catch (e) {
        // this will throw if this happens due to a blur event, nasty business
    }
}
export class RowCache {
    constructor(renderers) {
        this.renderers = renderers;
        this.cache = new Map();
        this.transactionNodesPendingRemoval = new Set();
        this.inTransaction = false;
    }
    /**
     * Returns a row either by creating a new one or reusing
     * a previously released row which shares the same templateId.
     *
     * @returns A row and `isReusingConnectedDomNode` if the row's node is already in the dom in a stale position.
     */
    alloc(templateId) {
        let result = this.getTemplateCache(templateId).pop();
        let isStale = false;
        if (result) {
            isStale = this.transactionNodesPendingRemoval.has(result.domNode);
            if (isStale) {
                this.transactionNodesPendingRemoval.delete(result.domNode);
            }
        }
        else {
            const domNode = $('.monaco-list-row');
            const renderer = this.getRenderer(templateId);
            const templateData = renderer.renderTemplate(domNode);
            result = { domNode, templateId, templateData };
        }
        return { row: result, isReusingConnectedDomNode: isStale };
    }
    /**
     * Releases the row for eventual reuse.
     */
    release(row) {
        if (!row) {
            return;
        }
        this.releaseRow(row);
    }
    /**
     * Begin a set of changes that use the cache. This lets us skip work when a row is removed and then inserted again.
     */
    transact(makeChanges) {
        if (this.inTransaction) {
            throw new Error('Already in transaction');
        }
        this.inTransaction = true;
        try {
            makeChanges();
        }
        finally {
            for (const domNode of this.transactionNodesPendingRemoval) {
                this.doRemoveNode(domNode);
            }
            this.transactionNodesPendingRemoval.clear();
            this.inTransaction = false;
        }
    }
    releaseRow(row) {
        const { domNode, templateId } = row;
        if (domNode) {
            if (this.inTransaction) {
                this.transactionNodesPendingRemoval.add(domNode);
            }
            else {
                this.doRemoveNode(domNode);
            }
        }
        const cache = this.getTemplateCache(templateId);
        cache.push(row);
    }
    doRemoveNode(domNode) {
        domNode.classList.remove('scrolling');
        removeFromParent(domNode);
    }
    getTemplateCache(templateId) {
        let result = this.cache.get(templateId);
        if (!result) {
            result = [];
            this.cache.set(templateId, result);
        }
        return result;
    }
    dispose() {
        this.cache.forEach((cachedRows, templateId) => {
            for (const cachedRow of cachedRows) {
                const renderer = this.getRenderer(templateId);
                renderer.disposeTemplate(cachedRow.templateData);
                cachedRow.templateData = null;
            }
        });
        this.cache.clear();
        this.transactionNodesPendingRemoval.clear();
    }
    getRenderer(templateId) {
        const renderer = this.renderers.get(templateId);
        if (!renderer) {
            throw new Error(`No renderer found for ${templateId}`);
        }
        return renderer;
    }
}
