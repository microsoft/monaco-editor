/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as extpath from './extpath.js';
import { Schemas } from './network.js';
import * as paths from './path.js';
import { isLinux, isWindows } from './platform.js';
import { compare as strCompare, equalsIgnoreCase } from './strings.js';
import { URI, uriToFsPath } from './uri.js';
export function originalFSPath(uri) {
    return uriToFsPath(uri, true);
}
export class ExtUri {
    constructor(_ignorePathCasing) {
        this._ignorePathCasing = _ignorePathCasing;
    }
    compare(uri1, uri2, ignoreFragment = false) {
        if (uri1 === uri2) {
            return 0;
        }
        return strCompare(this.getComparisonKey(uri1, ignoreFragment), this.getComparisonKey(uri2, ignoreFragment));
    }
    isEqual(uri1, uri2, ignoreFragment = false) {
        if (uri1 === uri2) {
            return true;
        }
        if (!uri1 || !uri2) {
            return false;
        }
        return this.getComparisonKey(uri1, ignoreFragment) === this.getComparisonKey(uri2, ignoreFragment);
    }
    getComparisonKey(uri, ignoreFragment = false) {
        return uri.with({
            path: this._ignorePathCasing(uri) ? uri.path.toLowerCase() : undefined,
            fragment: ignoreFragment ? null : undefined
        }).toString();
    }
    isEqualOrParent(base, parentCandidate, ignoreFragment = false) {
        if (base.scheme === parentCandidate.scheme) {
            if (base.scheme === Schemas.file) {
                return extpath.isEqualOrParent(originalFSPath(base), originalFSPath(parentCandidate), this._ignorePathCasing(base)) && base.query === parentCandidate.query && (ignoreFragment || base.fragment === parentCandidate.fragment);
            }
            if (isEqualAuthority(base.authority, parentCandidate.authority)) {
                return extpath.isEqualOrParent(base.path, parentCandidate.path, this._ignorePathCasing(base), '/') && base.query === parentCandidate.query && (ignoreFragment || base.fragment === parentCandidate.fragment);
            }
        }
        return false;
    }
    // --- path math
    joinPath(resource, ...pathFragment) {
        return URI.joinPath(resource, ...pathFragment);
    }
    basenameOrAuthority(resource) {
        return basename(resource) || resource.authority;
    }
    basename(resource) {
        return paths.posix.basename(resource.path);
    }
    extname(resource) {
        return paths.posix.extname(resource.path);
    }
    dirname(resource) {
        if (resource.path.length === 0) {
            return resource;
        }
        let dirname;
        if (resource.scheme === Schemas.file) {
            dirname = URI.file(paths.dirname(originalFSPath(resource))).path;
        }
        else {
            dirname = paths.posix.dirname(resource.path);
            if (resource.authority && dirname.length && dirname.charCodeAt(0) !== 47 /* CharCode.Slash */) {
                console.error(`dirname("${resource.toString})) resulted in a relative path`);
                dirname = '/'; // If a URI contains an authority component, then the path component must either be empty or begin with a CharCode.Slash ("/") character
            }
        }
        return resource.with({
            path: dirname
        });
    }
    normalizePath(resource) {
        if (!resource.path.length) {
            return resource;
        }
        let normalizedPath;
        if (resource.scheme === Schemas.file) {
            normalizedPath = URI.file(paths.normalize(originalFSPath(resource))).path;
        }
        else {
            normalizedPath = paths.posix.normalize(resource.path);
        }
        return resource.with({
            path: normalizedPath
        });
    }
    relativePath(from, to) {
        if (from.scheme !== to.scheme || !isEqualAuthority(from.authority, to.authority)) {
            return undefined;
        }
        if (from.scheme === Schemas.file) {
            const relativePath = paths.relative(originalFSPath(from), originalFSPath(to));
            return isWindows ? extpath.toSlashes(relativePath) : relativePath;
        }
        let fromPath = from.path || '/';
        const toPath = to.path || '/';
        if (this._ignorePathCasing(from)) {
            // make casing of fromPath match toPath
            let i = 0;
            for (const len = Math.min(fromPath.length, toPath.length); i < len; i++) {
                if (fromPath.charCodeAt(i) !== toPath.charCodeAt(i)) {
                    if (fromPath.charAt(i).toLowerCase() !== toPath.charAt(i).toLowerCase()) {
                        break;
                    }
                }
            }
            fromPath = toPath.substr(0, i) + fromPath.substr(i);
        }
        return paths.posix.relative(fromPath, toPath);
    }
    resolvePath(base, path) {
        if (base.scheme === Schemas.file) {
            const newURI = URI.file(paths.resolve(originalFSPath(base), path));
            return base.with({
                authority: newURI.authority,
                path: newURI.path
            });
        }
        path = extpath.toPosixPath(path); // we allow path to be a windows path
        return base.with({
            path: paths.posix.resolve(base.path, path)
        });
    }
    // --- misc
    isAbsolutePath(resource) {
        return !!resource.path && resource.path[0] === '/';
    }
    isEqualAuthority(a1, a2) {
        return a1 === a2 || (a1 !== undefined && a2 !== undefined && equalsIgnoreCase(a1, a2));
    }
    hasTrailingPathSeparator(resource, sep = paths.sep) {
        if (resource.scheme === Schemas.file) {
            const fsp = originalFSPath(resource);
            return fsp.length > extpath.getRoot(fsp).length && fsp[fsp.length - 1] === sep;
        }
        else {
            const p = resource.path;
            return (p.length > 1 && p.charCodeAt(p.length - 1) === 47 /* CharCode.Slash */) && !(/^[a-zA-Z]:(\/$|\\$)/.test(resource.fsPath)); // ignore the slash at offset 0
        }
    }
    removeTrailingPathSeparator(resource, sep = paths.sep) {
        // Make sure that the path isn't a drive letter. A trailing separator there is not removable.
        if (hasTrailingPathSeparator(resource, sep)) {
            return resource.with({ path: resource.path.substr(0, resource.path.length - 1) });
        }
        return resource;
    }
    addTrailingPathSeparator(resource, sep = paths.sep) {
        let isRootSep = false;
        if (resource.scheme === Schemas.file) {
            const fsp = originalFSPath(resource);
            isRootSep = ((fsp !== undefined) && (fsp.length === extpath.getRoot(fsp).length) && (fsp[fsp.length - 1] === sep));
        }
        else {
            sep = '/';
            const p = resource.path;
            isRootSep = p.length === 1 && p.charCodeAt(p.length - 1) === 47 /* CharCode.Slash */;
        }
        if (!isRootSep && !hasTrailingPathSeparator(resource, sep)) {
            return resource.with({ path: resource.path + '/' });
        }
        return resource;
    }
}
/**
 * Unbiased utility that takes uris "as they are". This means it can be interchanged with
 * uri#toString() usages. The following is true
 * ```
 * assertEqual(aUri.toString() === bUri.toString(), exturi.isEqual(aUri, bUri))
 * ```
 */
export const extUri = new ExtUri(() => false);
/**
 * BIASED utility that _mostly_ ignored the case of urs paths. ONLY use this util if you
 * understand what you are doing.
 *
 * This utility is INCOMPATIBLE with `uri.toString()`-usages and both CANNOT be used interchanged.
 *
 * When dealing with uris from files or documents, `extUri` (the unbiased friend)is sufficient
 * because those uris come from a "trustworthy source". When creating unknown uris it's always
 * better to use `IUriIdentityService` which exposes an `IExtUri`-instance which knows when path
 * casing matters.
 */
export const extUriBiasedIgnorePathCase = new ExtUri(uri => {
    // A file scheme resource is in the same platform as code, so ignore case for non linux platforms
    // Resource can be from another platform. Lowering the case as an hack. Should come from File system provider
    return uri.scheme === Schemas.file ? !isLinux : true;
});
/**
 * BIASED utility that always ignores the casing of uris paths. ONLY use this util if you
 * understand what you are doing.
 *
 * This utility is INCOMPATIBLE with `uri.toString()`-usages and both CANNOT be used interchanged.
 *
 * When dealing with uris from files or documents, `extUri` (the unbiased friend)is sufficient
 * because those uris come from a "trustworthy source". When creating unknown uris it's always
 * better to use `IUriIdentityService` which exposes an `IExtUri`-instance which knows when path
 * casing matters.
 */
export const extUriIgnorePathCase = new ExtUri(_ => true);
export const isEqual = extUri.isEqual.bind(extUri);
export const isEqualOrParent = extUri.isEqualOrParent.bind(extUri);
export const getComparisonKey = extUri.getComparisonKey.bind(extUri);
export const basenameOrAuthority = extUri.basenameOrAuthority.bind(extUri);
export const basename = extUri.basename.bind(extUri);
export const extname = extUri.extname.bind(extUri);
export const dirname = extUri.dirname.bind(extUri);
export const joinPath = extUri.joinPath.bind(extUri);
export const normalizePath = extUri.normalizePath.bind(extUri);
export const relativePath = extUri.relativePath.bind(extUri);
export const resolvePath = extUri.resolvePath.bind(extUri);
export const isAbsolutePath = extUri.isAbsolutePath.bind(extUri);
export const isEqualAuthority = extUri.isEqualAuthority.bind(extUri);
export const hasTrailingPathSeparator = extUri.hasTrailingPathSeparator.bind(extUri);
export const removeTrailingPathSeparator = extUri.removeTrailingPathSeparator.bind(extUri);
export const addTrailingPathSeparator = extUri.addTrailingPathSeparator.bind(extUri);
/**
 * Data URI related helpers.
 */
export var DataUri;
(function (DataUri) {
    DataUri.META_DATA_LABEL = 'label';
    DataUri.META_DATA_DESCRIPTION = 'description';
    DataUri.META_DATA_SIZE = 'size';
    DataUri.META_DATA_MIME = 'mime';
    function parseMetaData(dataUri) {
        const metadata = new Map();
        // Given a URI of:  data:image/png;size:2313;label:SomeLabel;description:SomeDescription;base64,77+9UE5...
        // the metadata is: size:2313;label:SomeLabel;description:SomeDescription
        const meta = dataUri.path.substring(dataUri.path.indexOf(';') + 1, dataUri.path.lastIndexOf(';'));
        meta.split(';').forEach(property => {
            const [key, value] = property.split(':');
            if (key && value) {
                metadata.set(key, value);
            }
        });
        // Given a URI of:  data:image/png;size:2313;label:SomeLabel;description:SomeDescription;base64,77+9UE5...
        // the mime is: image/png
        const mime = dataUri.path.substring(0, dataUri.path.indexOf(';'));
        if (mime) {
            metadata.set(DataUri.META_DATA_MIME, mime);
        }
        return metadata;
    }
    DataUri.parseMetaData = parseMetaData;
})(DataUri || (DataUri = {}));
