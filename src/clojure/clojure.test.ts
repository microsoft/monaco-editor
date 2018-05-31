/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { testTokenization } from '../test/testRunner';

testTokenization('clojure', [
  // Keywords
  [
    {
      line: 'defmacro some',
      tokens: [
        { startIndex: 0, type: 'keyword.clj' },
        { startIndex: 8, type: 'white.clj' },
        { startIndex: 9, type: 'variable.clj' },
      ],
    },

    {
      line: 'comment "text comment"',
      tokens: [
	{ startIndex: 0, type: 'keyword.clj' },
	{ startIndex: 7, type: 'white.clj'},
	{ startIndex: 8, type: 'string.clj'},
      ],
    },
    {
      line: 'in-ns "user',
      tokens: [
        { startIndex: 0, type: 'keyword.clj' },
        { startIndex: 5, type: 'white.clj' },
        { startIndex: 6, type: 'string.clj' },
      ],
    },
  ],

  // comments
  [
    {
      line: ';; comment',
      tokens: [{ startIndex: 0, type: 'comment.clj' }],
    },
  ],
  [
    {
      line: '(comment',
      tokens: [{ startIndex: 0, type: 'comment.clj' }],
    },
    {
      line: '(comment let',
      tokens: [
        { startIndex: 0, type: 'comment.clj' },
        { startIndex: 8, type: 'white.clj' },
        { startIndex: 9, type: 'keyword.clj' },
      ],
    },
  ],

  // strings
  [
    {
      line: '"\\n string "',
      tokens: [
        { startIndex: 0, type: 'string.clj' },
        { startIndex: 1, type: 'string.escape.clj' },
        { startIndex: 3, type: 'string.clj' },
      ],
    },
  ],
  [
    {
      line: '" string \\',
      tokens: [{ startIndex: 0, type: 'string.clj' }],
    },
    {
      line: 'multiline',
      tokens: [{ startIndex: 0, type: 'string.clj' }],
    },
    {
      line: ' ',
      tokens: [
        // previous line needs to be terminated with \
        { startIndex: 0, type: 'white.clj' },
      ],
    },
  ],

  // numbers
  [
    {
      line: '1e2',
      tokens: [{ startIndex: 0, type: 'number.float.clj' }],
    },
  ],
  [
    {
      line: '#x03BB',
      tokens: [{ startIndex: 0, type: 'number.hex.clj' }],
    },
  ],
]);
