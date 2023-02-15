import { compare, compareIgnoreCase, compareSubstring, compareSubstringIgnoreCase } from './strings.js';
export class StringIterator {
    constructor() {
        this._value = '';
        this._pos = 0;
    }
    reset(key) {
        this._value = key;
        this._pos = 0;
        return this;
    }
    next() {
        this._pos += 1;
        return this;
    }
    hasNext() {
        return this._pos < this._value.length - 1;
    }
    cmp(a) {
        const aCode = a.charCodeAt(0);
        const thisCode = this._value.charCodeAt(this._pos);
        return aCode - thisCode;
    }
    value() {
        return this._value[this._pos];
    }
}
export class ConfigKeysIterator {
    constructor(_caseSensitive = true) {
        this._caseSensitive = _caseSensitive;
    }
    reset(key) {
        this._value = key;
        this._from = 0;
        this._to = 0;
        return this.next();
    }
    hasNext() {
        return this._to < this._value.length;
    }
    next() {
        // this._data = key.split(/[\\/]/).filter(s => !!s);
        this._from = this._to;
        let justSeps = true;
        for (; this._to < this._value.length; this._to++) {
            const ch = this._value.charCodeAt(this._to);
            if (ch === 46 /* CharCode.Period */) {
                if (justSeps) {
                    this._from++;
                }
                else {
                    break;
                }
            }
            else {
                justSeps = false;
            }
        }
        return this;
    }
    cmp(a) {
        return this._caseSensitive
            ? compareSubstring(a, this._value, 0, a.length, this._from, this._to)
            : compareSubstringIgnoreCase(a, this._value, 0, a.length, this._from, this._to);
    }
    value() {
        return this._value.substring(this._from, this._to);
    }
}
export class PathIterator {
    constructor(_splitOnBackslash = true, _caseSensitive = true) {
        this._splitOnBackslash = _splitOnBackslash;
        this._caseSensitive = _caseSensitive;
    }
    reset(key) {
        this._from = 0;
        this._to = 0;
        this._value = key;
        this._valueLen = key.length;
        for (let pos = key.length - 1; pos >= 0; pos--, this._valueLen--) {
            const ch = this._value.charCodeAt(pos);
            if (!(ch === 47 /* CharCode.Slash */ || this._splitOnBackslash && ch === 92 /* CharCode.Backslash */)) {
                break;
            }
        }
        return this.next();
    }
    hasNext() {
        return this._to < this._valueLen;
    }
    next() {
        // this._data = key.split(/[\\/]/).filter(s => !!s);
        this._from = this._to;
        let justSeps = true;
        for (; this._to < this._valueLen; this._to++) {
            const ch = this._value.charCodeAt(this._to);
            if (ch === 47 /* CharCode.Slash */ || this._splitOnBackslash && ch === 92 /* CharCode.Backslash */) {
                if (justSeps) {
                    this._from++;
                }
                else {
                    break;
                }
            }
            else {
                justSeps = false;
            }
        }
        return this;
    }
    cmp(a) {
        return this._caseSensitive
            ? compareSubstring(a, this._value, 0, a.length, this._from, this._to)
            : compareSubstringIgnoreCase(a, this._value, 0, a.length, this._from, this._to);
    }
    value() {
        return this._value.substring(this._from, this._to);
    }
}
export class UriIterator {
    constructor(_ignorePathCasing, _ignoreQueryAndFragment) {
        this._ignorePathCasing = _ignorePathCasing;
        this._ignoreQueryAndFragment = _ignoreQueryAndFragment;
        this._states = [];
        this._stateIdx = 0;
    }
    reset(key) {
        this._value = key;
        this._states = [];
        if (this._value.scheme) {
            this._states.push(1 /* UriIteratorState.Scheme */);
        }
        if (this._value.authority) {
            this._states.push(2 /* UriIteratorState.Authority */);
        }
        if (this._value.path) {
            this._pathIterator = new PathIterator(false, !this._ignorePathCasing(key));
            this._pathIterator.reset(key.path);
            if (this._pathIterator.value()) {
                this._states.push(3 /* UriIteratorState.Path */);
            }
        }
        if (!this._ignoreQueryAndFragment(key)) {
            if (this._value.query) {
                this._states.push(4 /* UriIteratorState.Query */);
            }
            if (this._value.fragment) {
                this._states.push(5 /* UriIteratorState.Fragment */);
            }
        }
        this._stateIdx = 0;
        return this;
    }
    next() {
        if (this._states[this._stateIdx] === 3 /* UriIteratorState.Path */ && this._pathIterator.hasNext()) {
            this._pathIterator.next();
        }
        else {
            this._stateIdx += 1;
        }
        return this;
    }
    hasNext() {
        return (this._states[this._stateIdx] === 3 /* UriIteratorState.Path */ && this._pathIterator.hasNext())
            || this._stateIdx < this._states.length - 1;
    }
    cmp(a) {
        if (this._states[this._stateIdx] === 1 /* UriIteratorState.Scheme */) {
            return compareIgnoreCase(a, this._value.scheme);
        }
        else if (this._states[this._stateIdx] === 2 /* UriIteratorState.Authority */) {
            return compareIgnoreCase(a, this._value.authority);
        }
        else if (this._states[this._stateIdx] === 3 /* UriIteratorState.Path */) {
            return this._pathIterator.cmp(a);
        }
        else if (this._states[this._stateIdx] === 4 /* UriIteratorState.Query */) {
            return compare(a, this._value.query);
        }
        else if (this._states[this._stateIdx] === 5 /* UriIteratorState.Fragment */) {
            return compare(a, this._value.fragment);
        }
        throw new Error();
    }
    value() {
        if (this._states[this._stateIdx] === 1 /* UriIteratorState.Scheme */) {
            return this._value.scheme;
        }
        else if (this._states[this._stateIdx] === 2 /* UriIteratorState.Authority */) {
            return this._value.authority;
        }
        else if (this._states[this._stateIdx] === 3 /* UriIteratorState.Path */) {
            return this._pathIterator.value();
        }
        else if (this._states[this._stateIdx] === 4 /* UriIteratorState.Query */) {
            return this._value.query;
        }
        else if (this._states[this._stateIdx] === 5 /* UriIteratorState.Fragment */) {
            return this._value.fragment;
        }
        throw new Error();
    }
}
class TernarySearchTreeNode {
    constructor() {
        this.height = 1;
    }
    rotateLeft() {
        const tmp = this.right;
        this.right = tmp.left;
        tmp.left = this;
        this.updateHeight();
        tmp.updateHeight();
        return tmp;
    }
    rotateRight() {
        const tmp = this.left;
        this.left = tmp.right;
        tmp.right = this;
        this.updateHeight();
        tmp.updateHeight();
        return tmp;
    }
    updateHeight() {
        this.height = 1 + Math.max(this.heightLeft, this.heightRight);
    }
    balanceFactor() {
        return this.heightRight - this.heightLeft;
    }
    get heightLeft() {
        var _a, _b;
        return (_b = (_a = this.left) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0;
    }
    get heightRight() {
        var _a, _b;
        return (_b = (_a = this.right) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0;
    }
}
export class TernarySearchTree {
    static forUris(ignorePathCasing = () => false, ignoreQueryAndFragment = () => false) {
        return new TernarySearchTree(new UriIterator(ignorePathCasing, ignoreQueryAndFragment));
    }
    static forStrings() {
        return new TernarySearchTree(new StringIterator());
    }
    static forConfigKeys() {
        return new TernarySearchTree(new ConfigKeysIterator());
    }
    constructor(segments) {
        this._iter = segments;
    }
    clear() {
        this._root = undefined;
    }
    set(key, element) {
        const iter = this._iter.reset(key);
        let node;
        if (!this._root) {
            this._root = new TernarySearchTreeNode();
            this._root.segment = iter.value();
        }
        const stack = [];
        // find insert_node
        node = this._root;
        while (true) {
            const val = iter.cmp(node.segment);
            if (val > 0) {
                // left
                if (!node.left) {
                    node.left = new TernarySearchTreeNode();
                    node.left.segment = iter.value();
                }
                stack.push([-1 /* Dir.Left */, node]);
                node = node.left;
            }
            else if (val < 0) {
                // right
                if (!node.right) {
                    node.right = new TernarySearchTreeNode();
                    node.right.segment = iter.value();
                }
                stack.push([1 /* Dir.Right */, node]);
                node = node.right;
            }
            else if (iter.hasNext()) {
                // mid
                iter.next();
                if (!node.mid) {
                    node.mid = new TernarySearchTreeNode();
                    node.mid.segment = iter.value();
                }
                stack.push([0 /* Dir.Mid */, node]);
                node = node.mid;
            }
            else {
                break;
            }
        }
        // set value
        const oldElement = node.value;
        node.value = element;
        node.key = key;
        // balance
        for (let i = stack.length - 1; i >= 0; i--) {
            const node = stack[i][1];
            node.updateHeight();
            const bf = node.balanceFactor();
            if (bf < -1 || bf > 1) {
                // needs rotate
                const d1 = stack[i][0];
                const d2 = stack[i + 1][0];
                if (d1 === 1 /* Dir.Right */ && d2 === 1 /* Dir.Right */) {
                    //right, right -> rotate left
                    stack[i][1] = node.rotateLeft();
                }
                else if (d1 === -1 /* Dir.Left */ && d2 === -1 /* Dir.Left */) {
                    // left, left -> rotate right
                    stack[i][1] = node.rotateRight();
                }
                else if (d1 === 1 /* Dir.Right */ && d2 === -1 /* Dir.Left */) {
                    // right, left -> double rotate right, left
                    node.right = stack[i + 1][1] = stack[i + 1][1].rotateRight();
                    stack[i][1] = node.rotateLeft();
                }
                else if (d1 === -1 /* Dir.Left */ && d2 === 1 /* Dir.Right */) {
                    // left, right -> double rotate left, right
                    node.left = stack[i + 1][1] = stack[i + 1][1].rotateLeft();
                    stack[i][1] = node.rotateRight();
                }
                else {
                    throw new Error();
                }
                // patch path to parent
                if (i > 0) {
                    switch (stack[i - 1][0]) {
                        case -1 /* Dir.Left */:
                            stack[i - 1][1].left = stack[i][1];
                            break;
                        case 1 /* Dir.Right */:
                            stack[i - 1][1].right = stack[i][1];
                            break;
                        case 0 /* Dir.Mid */:
                            stack[i - 1][1].mid = stack[i][1];
                            break;
                    }
                }
                else {
                    this._root = stack[0][1];
                }
            }
        }
        return oldElement;
    }
    get(key) {
        var _a;
        return (_a = this._getNode(key)) === null || _a === void 0 ? void 0 : _a.value;
    }
    _getNode(key) {
        const iter = this._iter.reset(key);
        let node = this._root;
        while (node) {
            const val = iter.cmp(node.segment);
            if (val > 0) {
                // left
                node = node.left;
            }
            else if (val < 0) {
                // right
                node = node.right;
            }
            else if (iter.hasNext()) {
                // mid
                iter.next();
                node = node.mid;
            }
            else {
                break;
            }
        }
        return node;
    }
    has(key) {
        const node = this._getNode(key);
        return !((node === null || node === void 0 ? void 0 : node.value) === undefined && (node === null || node === void 0 ? void 0 : node.mid) === undefined);
    }
    delete(key) {
        return this._delete(key, false);
    }
    deleteSuperstr(key) {
        return this._delete(key, true);
    }
    _delete(key, superStr) {
        var _a;
        const iter = this._iter.reset(key);
        const stack = [];
        let node = this._root;
        // find node
        while (node) {
            const val = iter.cmp(node.segment);
            if (val > 0) {
                // left
                stack.push([-1 /* Dir.Left */, node]);
                node = node.left;
            }
            else if (val < 0) {
                // right
                stack.push([1 /* Dir.Right */, node]);
                node = node.right;
            }
            else if (iter.hasNext()) {
                // mid
                iter.next();
                stack.push([0 /* Dir.Mid */, node]);
                node = node.mid;
            }
            else {
                break;
            }
        }
        if (!node) {
            // node not found
            return;
        }
        if (superStr) {
            // removing children, reset height
            node.left = undefined;
            node.mid = undefined;
            node.right = undefined;
            node.height = 1;
        }
        else {
            // removing element
            node.key = undefined;
            node.value = undefined;
        }
        // BST node removal
        if (!node.mid && !node.value) {
            if (node.left && node.right) {
                // full node
                // replace deleted-node with the min-node of the right branch.
                // If there is no true min-node leave things as they are
                const min = this._min(node.right);
                if (min.key) {
                    const { key, value, segment } = min;
                    this._delete(min.key, false);
                    node.key = key;
                    node.value = value;
                    node.segment = segment;
                }
            }
            else {
                // empty or half empty
                const newChild = (_a = node.left) !== null && _a !== void 0 ? _a : node.right;
                if (stack.length > 0) {
                    const [dir, parent] = stack[stack.length - 1];
                    switch (dir) {
                        case -1 /* Dir.Left */:
                            parent.left = newChild;
                            break;
                        case 0 /* Dir.Mid */:
                            parent.mid = newChild;
                            break;
                        case 1 /* Dir.Right */:
                            parent.right = newChild;
                            break;
                    }
                }
                else {
                    this._root = newChild;
                }
            }
        }
        // AVL balance
        for (let i = stack.length - 1; i >= 0; i--) {
            const node = stack[i][1];
            node.updateHeight();
            const bf = node.balanceFactor();
            if (bf > 1) {
                // right heavy
                if (node.right.balanceFactor() >= 0) {
                    // right, right -> rotate left
                    stack[i][1] = node.rotateLeft();
                }
                else {
                    // right, left -> double rotate
                    node.right = node.right.rotateRight();
                    stack[i][1] = node.rotateLeft();
                }
            }
            else if (bf < -1) {
                // left heavy
                if (node.left.balanceFactor() <= 0) {
                    // left, left -> rotate right
                    stack[i][1] = node.rotateRight();
                }
                else {
                    // left, right -> double rotate
                    node.left = node.left.rotateLeft();
                    stack[i][1] = node.rotateRight();
                }
            }
            // patch path to parent
            if (i > 0) {
                switch (stack[i - 1][0]) {
                    case -1 /* Dir.Left */:
                        stack[i - 1][1].left = stack[i][1];
                        break;
                    case 1 /* Dir.Right */:
                        stack[i - 1][1].right = stack[i][1];
                        break;
                    case 0 /* Dir.Mid */:
                        stack[i - 1][1].mid = stack[i][1];
                        break;
                }
            }
            else {
                this._root = stack[0][1];
            }
        }
    }
    _min(node) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }
    findSubstr(key) {
        const iter = this._iter.reset(key);
        let node = this._root;
        let candidate = undefined;
        while (node) {
            const val = iter.cmp(node.segment);
            if (val > 0) {
                // left
                node = node.left;
            }
            else if (val < 0) {
                // right
                node = node.right;
            }
            else if (iter.hasNext()) {
                // mid
                iter.next();
                candidate = node.value || candidate;
                node = node.mid;
            }
            else {
                break;
            }
        }
        return node && node.value || candidate;
    }
    findSuperstr(key) {
        return this._findSuperstrOrElement(key, false);
    }
    _findSuperstrOrElement(key, allowValue) {
        const iter = this._iter.reset(key);
        let node = this._root;
        while (node) {
            const val = iter.cmp(node.segment);
            if (val > 0) {
                // left
                node = node.left;
            }
            else if (val < 0) {
                // right
                node = node.right;
            }
            else if (iter.hasNext()) {
                // mid
                iter.next();
                node = node.mid;
            }
            else {
                // collect
                if (!node.mid) {
                    if (allowValue) {
                        return node.value;
                    }
                    else {
                        return undefined;
                    }
                }
                else {
                    return this._entries(node.mid);
                }
            }
        }
        return undefined;
    }
    forEach(callback) {
        for (const [key, value] of this) {
            callback(value, key);
        }
    }
    *[Symbol.iterator]() {
        yield* this._entries(this._root);
    }
    _entries(node) {
        const result = [];
        this._dfsEntries(node, result);
        return result[Symbol.iterator]();
    }
    _dfsEntries(node, bucket) {
        // DFS
        if (!node) {
            return;
        }
        if (node.left) {
            this._dfsEntries(node.left, bucket);
        }
        if (node.value) {
            bucket.push([node.key, node.value]);
        }
        if (node.mid) {
            this._dfsEntries(node.mid, bucket);
        }
        if (node.right) {
            this._dfsEntries(node.right, bucket);
        }
    }
}
