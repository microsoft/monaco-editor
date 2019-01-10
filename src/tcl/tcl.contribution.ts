/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import {registerLanguage} from '../_.contribution';

const _monaco: typeof monaco = (typeof monaco === 'undefined' ? (<any>self).monaco : monaco);

registerLanguage({
	id: 'tcl',
	extensions: ['.tcl'],
	aliases: ['tcl', 'Tcl', 'tcltk', 'TclTk', 'tcl/tk', 'Tcl/Tk'],
	loader: () => _monaco.Promise.wrap(import('./tcl'))
});
