/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { SyncDescriptor } from './descriptors.js';
const _registry = [];
export function registerSingleton(id, ctorOrDescriptor, supportsDelayedInstantiation) {
    if (!(ctorOrDescriptor instanceof SyncDescriptor)) {
        ctorOrDescriptor = new SyncDescriptor(ctorOrDescriptor, [], Boolean(supportsDelayedInstantiation));
    }
    _registry.push([id, ctorOrDescriptor]);
}
export function getSingletonServiceDescriptors() {
    return _registry;
}
