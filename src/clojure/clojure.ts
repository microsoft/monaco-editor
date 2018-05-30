/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

export const conf: IRichLanguageConfiguration = {
  comments: {
    lineComment: ';;',
    blockComment: ['(comment', ')'],
  },

  brackets: [['(', ')'], ['{', '}'], ['[', ']']],

  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],

  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],
};

export const language = <ILanguage>{
  defaultToken: '',
  ignoreCase: true,
  tokenPostfix: '.clj',

  brackets: [
    { open: '(', close: ')', token: 'delimiter.parenthesis' },
    { open: '{', close: '}', token: 'delimiter.curly' },
    { open: '[', close: ']', token: 'delimiter.square' },
  ],

  keywords: [
    'ns',
    'ns-unmap',
    'fn',
    'def',
    'defn',
    'defmacro',
    'defmulti',
    'defonce',
    'bound\\-fn',
    'if',
    'if\\-not',
    'case,',
    'cond',
    'condp',
    'cond\\-\\>',
    'cond\\-\\>\\>',
    'when',
    'while',
    'when\\-not',
    'when\\-first',
    'do',
    'future',
    'comment',
    'doto',
    'locking',
    'proxy',
    'as\\-\\>',
    'reify',
    'deftype',
    'defrecord',
    'defprotocol',
    'extend',
    'extend-protocol',
    'extend-type',
    'specify',
    'specify\\!',
    'try',
    'catch',
    'finally',
    'let',
    'letfn',
    'binding',
    'loop',
    'for',
    'doseq',
    'dotimes',
    'when\\-let',
    'if\\-let',
    'when\\-some',
    'if\\-some',
    'this\\-as',
    'defmethod',
    'testing',
    'deftest',
    'are',
    'use\\-fixtures',
    'run',
    'run\\*',
    'fresh',
    'alt!',
    'alt!!',
    'go',
    'go\\-loop',
    'thread',
  ],

  constants: ['true', 'false', 'nil'],

  operators: ['=', 'not=', '<', '<=', '>', '>=', 'and', 'or', 'not', 'inc', 'dec', 'max', 'min', 'rem', 'bit-and', 'bit-or', 'bit-xor', 'bit-not'],

  tokenizer: {
    root: [
      [/#[xXoObB][0-9a-fA-F]+/, 'number.hex'],
      [/[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?/, 'number.float'],

      [/(?:\b(?:(def|defn|defmacro|defmulti|defonce|ns|ns-unmap|fn))\b)(\s+)((?:\w|\-|\!|\?)*)/, ['keyword', 'white', 'variable']],

      [
        /[a-zA-Z_#][a-zA-Z0-9_\-\?\!\*]*/,
        {
          cases: {
            '@keywords': 'keyword',
            '@constants': 'constant',
            '@operators': 'operators',
            '@default': 'identifier',
          },
        },
      ],

      { include: '@whitespace' },
      { include: '@strings' },
    ],

    comment: [
      [/[^\(comment]+/, 'comment'],
      [/\)/, 'comment', '@push'],
      [/\(comment/, 'comment', '@pop'],
      [/[\)]/, 'comment'],
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\(comment/, 'comment', '@comment'],
      [/;;.*$/, 'comment'],
    ],

    strings: [
      [/"$/, 'string', '@popall'],
      [/"(?=.)/, 'string', '@multiLineString'],
    ],

    multiLineString: [
      [/\\./, 'string.escape'],
      [/"/, 'string', '@popall'],
      [/.(?=.*")/, 'string'],
      [/.*\\$/, 'string'],
      [/.*$/, 'string', '@popall'],
    ],
  },
};
