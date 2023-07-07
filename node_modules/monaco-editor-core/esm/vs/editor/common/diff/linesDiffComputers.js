/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { SmartLinesDiffComputer } from './smartLinesDiffComputer.js';
import { StandardLinesDiffComputer } from './standardLinesDiffComputer.js';
export const linesDiffComputers = {
    getLegacy: () => new SmartLinesDiffComputer(),
    getAdvanced: () => new StandardLinesDiffComputer(),
};
