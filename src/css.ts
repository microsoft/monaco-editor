/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import LanguageConfiguration = monaco.languages.LanguageConfiguration;
import IMonarchLanguage = monaco.languages.IMonarchLanguage;

export var conf:LanguageConfiguration = {
    wordPattern: /(#?-?\d*\.\d\w*%?)|((::|[@#.!:])?[\w-?]+%?)|::|[@#.!:]/g,

    comments: {
        blockComment: ['/*', '*/']
    },

    brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
    ],

    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"', notIn: ['string'] },
        { open: '\'', close: '\'', notIn: ['string'] }
    ]
};

const TOKEN_SELECTOR = 'entity.name.selector';
const TOKEN_SELECTOR_TAG = 'entity.name.tag';
const TOKEN_PROPERTY = 'support.type.property-name';
const TOKEN_VALUE = 'support.property-value';
const TOKEN_AT_KEYWORD = 'keyword.control.at-rule';

export var language = <IMonarchLanguage> {
    defaultToken: '',
    tokenPostfix: '.css',

    ws: '[ \t\n\r\f]*', // whitespaces (referenced in several rules)
    identifier: '-?-?([a-zA-Z]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))([\\w\\-]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))*',

    brackets: [
        { open: '{', close: '}', token: 'punctuation.curly' },
        { open: '[', close: ']', token: 'punctuation.bracket' },
        { open: '(', close: ')', token: 'punctuation.parenthesis' },
        { open: '<', close: '>', token: 'punctuation.angle' }
    ],

    tokenizer: {
        root: [
            { include: '@selector' },
        ],

        selector: [
            { include: '@comments' },
            { include: '@import' },
            ['[@](keyframes|-webkit-keyframes|-moz-keyframes|-o-keyframes)', { token: TOKEN_AT_KEYWORD, next: '@keyframedeclaration' }],
            ['[@](page|content|font-face|-moz-document)', { token: TOKEN_AT_KEYWORD }],
            ['[@](charset|namespace)', { token: TOKEN_AT_KEYWORD, next: '@declarationbody' }],
            ['url(\\-prefix)?\\(', { token: 'support.function.name', bracket: '@open', next: '@urldeclaration' }],
            { include: '@selectorname' },
            ['[\\*]', TOKEN_SELECTOR_TAG], // selector symbols
            ['[>\\+,]', 'punctuation'], // selector operators
            ['\\[', { token: 'punctuation.bracket', bracket: '@open', next: '@selectorattribute' }],
            ['{', { token: 'punctuation.curly', bracket: '@open', next: '@selectorbody' }]
        ],

        selectorbody: [
            ['[*_]?@identifier@ws:(?=(\\s|\\d|[^{;}]*[;}]))', TOKEN_PROPERTY, '@rulevalue'], // rule definition: to distinguish from a nested selector check for whitespace, number or a semicolon
            ['}', { token: 'punctuation.curly', bracket: '@close', next: '@pop' }]
        ],

        selectorname: [
            ['(\\.|#(?=[^{])|%|(@identifier)|:)+', TOKEN_SELECTOR], // selector (.foo, div, ...)
        ],

        selectorattribute: [
            { include: '@term' },
            [']', { token: 'punctuation.bracket', bracket: '@close', next: '@pop' }],
        ],

        term: [
            { include: '@comments' },
            ['url(\\-prefix)?\\(', { token: 'support.function.name', bracket: '@open', next: '@urldeclaration' }],
            { include: '@functioninvocation' },
            { include: '@numbers' },
            { include: '@name' },
            ['([<>=\\+\\-\\*\\/\\^\\|\\~,])', 'keyword.operator'],
            [',', 'punctuation']
        ],

        rulevalue: [
            { include: '@term' },
            ['!important', 'literal'],
            [';', 'punctuation', '@pop'],
            ['(?=})', { token: '', next: '@pop' }] // missing semicolon
        ],

        warndebug: [
            ['[@](warn|debug)', { token: TOKEN_AT_KEYWORD, next: '@declarationbody' }]
        ],

        import: [
            ['[@](import)', { token: TOKEN_AT_KEYWORD, next: '@declarationbody' }]
        ],

        urldeclaration: [
            { include: '@strings' },
            ['[^)\r\n]+', 'string'],
            ['\\)', { token: 'support.function.name', bracket: '@close', next: '@pop' }]
        ],

        parenthizedterm: [
            { include: '@term' },
            ['\\)', { token: 'punctuation.parenthesis', bracket: '@close', next: '@pop' }]
        ],

        declarationbody: [
            { include: '@term' },
            [';', 'punctuation', '@pop'],
            ['(?=})', { token: '', next: '@pop' }] // missing semicolon
        ],

        comments: [
            ['\\/\\*', 'comment', '@comment'],
            ['\\/\\/+.*', 'comment']
        ],

        comment: [
            ['\\*\\/', 'comment', '@pop'],
            ['.', 'comment']
        ],

        name: [
            ['@identifier', TOKEN_VALUE]
        ],

        numbers: [
            ['(\\d*\\.)?\\d+([eE][\\-+]?\\d+)?', { token: 'constant.numeric', next: '@units' }],
            ['#[0-9a-fA-F_]+(?!\\w)', 'constant.rgb-value']
        ],

        units: [
            ['(em|ex|ch|rem|vmin|vmax|vw|vh|vm|cm|mm|in|px|pt|pc|deg|grad|rad|turn|s|ms|Hz|kHz|%)?', 'constant.numeric', '@pop']
        ],

        keyframedeclaration: [
            ['@identifier', 'support.function.name'],
            ['{', { token: 'punctuation.curly', bracket: '@open', switchTo: '@keyframebody' }],
        ],

        keyframebody: [
            { include: '@term' },
            ['{', { token: 'punctuation.curly', bracket: '@open', next: '@selectorbody' }],
            ['}', { token: 'punctuation.curly', bracket: '@close', next: '@pop' }],
        ],

        functioninvocation: [
            ['@identifier\\(', { token: 'support.function.name', bracket: '@open', next: '@functionarguments' }],
        ],

        functionarguments: [
            ['\\$@identifier@ws:', TOKEN_PROPERTY],
            ['[,]', 'punctuation'],
            { include: '@term' },
            ['\\)', { token: 'support.function.name', bracket: '@close', next: '@pop' }],
        ],

        strings: [
            ['~?"', { token: 'string.punctuation', bracket: '@open', next: '@stringenddoublequote' }],
            ['~?\'', { token: 'string.punctuation', bracket: '@open', next: '@stringendquote' }]
        ],

        stringenddoublequote: [
            ['\\\\.', 'string'],
            ['"', { token: 'string.punctuation', next: '@pop', bracket: '@close' }],
            ['.', 'string']
        ],

        stringendquote: [
            ['\\\\.', 'string'],
            ['\'', { token: 'string.punctuation', next: '@pop', bracket: '@close' }],
            ['.', 'string']
        ]
    }
};