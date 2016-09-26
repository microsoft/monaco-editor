/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import LanguageConfiguration = monaco.languages.LanguageConfiguration;
import IMonarchLanguage = monaco.languages.IMonarchLanguage;

export var conf: LanguageConfiguration = {
    wordPattern: /(#?-?\d*\.\d\w*%?)|([@$#!.:]?[\w-?]+%?)|[@#!.]/g,
    comments: {
        blockComment: ['/*', '*/'],
        lineComment: '//'
    },
    brackets: [['{', '}'], ['[', ']'], ['(', ')'], ['<', '>']],
    autoClosingPairs: [
        { open: '"', close: '"', notIn: ['string', 'comment'] },
        { open: '\'', close: '\'', notIn: ['string', 'comment'] },
        { open: '{', close: '}', notIn: ['string', 'comment'] },
        { open: '[', close: ']', notIn: ['string', 'comment'] },
        { open: '(', close: ')', notIn: ['string', 'comment'] },
        { open: '<', close: '>', notIn: ['string', 'comment'] },
    ]
};

const TOKEN_SELECTOR = 'entity.name.selector';
const TOKEN_SELECTOR_TAG = 'entity.name.tag';
const TOKEN_PROPERTY = 'support.type.property-name';
const TOKEN_VALUE = 'support.property-value';
const TOKEN_AT_KEYWORD = 'keyword.control.at-rule';

export var language = <IMonarchLanguage> {
    defaultToken: '',
    tokenPostfix: '.scss',

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
            { include: '@variabledeclaration' },
            { include: '@warndebug' }, // sass: log statements
            ['[@](include)', { token: TOKEN_AT_KEYWORD, next: '@includedeclaration' }], // sass: include statement
            ['[@](keyframes|-webkit-keyframes|-moz-keyframes|-o-keyframes)', { token: TOKEN_AT_KEYWORD, next: '@keyframedeclaration' }],
            ['[@](page|content|font-face|-moz-document)', { token: TOKEN_AT_KEYWORD }], // sass: placeholder for includes
            ['[@](charset|namespace)', { token: TOKEN_AT_KEYWORD, next: '@declarationbody' }],
            ['[@](function)', { token: TOKEN_AT_KEYWORD, next: '@functiondeclaration' }],
            ['[@](mixin)', { token: TOKEN_AT_KEYWORD, next: '@mixindeclaration' }],
            ['url(\\-prefix)?\\(', { token: 'support.function.name', bracket: '@open', next: '@urldeclaration' }],
            { include: '@controlstatement' }, // sass control statements
            { include: '@selectorname' },
            ['[&\\*]', TOKEN_SELECTOR_TAG], // selector symbols
            ['[>\\+,]', 'punctuation'], // selector operators
            ['\\[', { token: 'punctuation.bracket', bracket: '@open', next: '@selectorattribute' }],
            ['{', { token: 'punctuation.curly', bracket: '@open', next: '@selectorbody' }],
        ],

        selectorbody: [
            ['[*_]?@identifier@ws:(?=(\\s|\\d|[^{;}]*[;}]))', TOKEN_PROPERTY, '@rulevalue'], // rule definition: to distinguish from a nested selector check for whitespace, number or a semicolon
            { include: '@selector' }, // sass: nested selectors
            ['[@](extend)', { token: TOKEN_AT_KEYWORD, next: '@extendbody' }], // sass: extend other selectors
            ['[@](return)', { token: TOKEN_AT_KEYWORD, next: '@declarationbody' }],
            ['}', { token: 'punctuation.curly', bracket: '@close', next: '@pop' }],
        ],

        selectorname: [
            ['#{', { token: 'support.function.interpolation', bracket: '@open', next: '@variableinterpolation' }], // sass: interpolation
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
            { include: '@strings' },
            { include: '@variablereference' },
            ['(and\\b|or\\b|not\\b)', 'keyword.operator'],
            { include: '@name' },
            ['([<>=\\+\\-\\*\\/\\^\\|\\~,])', 'keyword.operator'],
            [',', 'punctuation'],
            ['!default', 'literal'],
            ['\\(', { token: 'punctuation.parenthesis', bracket: '@open', next: '@parenthizedterm' }],
        ],

        rulevalue: [
            { include: '@term' },
            ['!important', 'literal'],
            [';', 'punctuation', '@pop'],
            ['{', { token: 'punctuation.curly', bracket: '@open', switchTo: '@nestedproperty' }], // sass: nested properties
            ['(?=})', { token: '', next: '@pop' }], // missing semicolon
        ],

        nestedproperty: [
            ['[*_]?@identifier@ws:', TOKEN_PROPERTY, '@rulevalue'],
            { include: '@comments' },
            ['}', { token: 'punctuation.curly', bracket: '@close', next: '@pop' }],
        ],

        warndebug: [
            ['[@](warn|debug)', { token: TOKEN_AT_KEYWORD, next: '@declarationbody' }],
        ],

        import: [
            ['[@](import)', { token: TOKEN_AT_KEYWORD, next: '@declarationbody' }],
        ],

        variabledeclaration: [ // sass variables
            ['\\$@identifier@ws:', 'variable.decl', '@declarationbody'],
        ],

        urldeclaration: [
            { include: '@strings' },
            ['[^)\r\n]+', 'string'],
            ['\\)', { token: 'support.function.name', bracket: '@close', next: '@pop' }],
        ],

        parenthizedterm: [
            { include: '@term' },
            ['\\)', { token: 'punctuation.parenthesis', bracket: '@close', next: '@pop' }],
        ],

        declarationbody: [
            { include: '@term' },
            [';', 'punctuation', '@pop'],
            ['(?=})', { token: '', next: '@pop' }], // missing semicolon
        ],

        extendbody: [
            { include: '@selectorname' },
            ['!optional', 'literal'],
            [';', 'punctuation', '@pop'],
            ['(?=})', { token: '', next: '@pop' }], // missing semicolon
        ],

        variablereference: [ // sass variable reference
            ['\\$@identifier', 'variable.ref'],
            ['\\.\\.\\.', 'keyword.operator'], // var args in reference
            ['#{', { token: 'support.function.interpolation', bracket: '@open', next: '@variableinterpolation' }], // sass var resolve
        ],

        variableinterpolation: [
            { include: '@variablereference' },
            ['}', { token: 'support.function.interpolation', bracket: '@close', next: '@pop' }],
        ],

        comments: [
            ['\\/\\*', 'comment', '@comment'],
            ['\\/\\/+.*', 'comment'],
        ],

        comment: [
            ['\\*\\/', 'comment', '@pop'],
            ['.', 'comment'],
        ],

        name: [
            ['@identifier', TOKEN_VALUE],
        ],

        numbers: [
            ['(\\d*\\.)?\\d+([eE][\\-+]?\\d+)?', { token: 'constant.numeric', next: '@units' }],
            ['#[0-9a-fA-F_]+(?!\\w)', 'constant.rgb-value'],
        ],

        units: [
            ['(em|ex|ch|rem|vmin|vmax|vw|vh|vm|cm|mm|in|px|pt|pc|deg|grad|rad|turn|s|ms|Hz|kHz|%)?', 'constant.numeric', '@pop']
        ],

        functiondeclaration: [
            ['@identifier@ws\\(', { token: 'support.function.name', bracket: '@open', next: '@parameterdeclaration' }],
            ['{', { token: 'punctuation.curly', bracket: '@open', switchTo: '@functionbody' }],
        ],

        mixindeclaration: [
            // mixin with parameters
            ['@identifier@ws\\(', { token: 'support.function.name', bracket: '@open', next: '@parameterdeclaration' }],
            // mixin without parameters
            ['@identifier', 'support.function.name'],
            ['{', { token: 'punctuation.curly', bracket: '@open', switchTo: '@selectorbody' }],
        ],

        parameterdeclaration: [
            ['\\$@identifier@ws:', 'variable'],
            ['\\.\\.\\.', 'keyword.operator'], // var args in declaration
            [',', 'punctuation'],
            { include: '@term' },
            ['\\)', { token: 'support.function.name', bracket: '@close', next: '@pop' }],
        ],

        includedeclaration: [
            { include: '@functioninvocation' },
            ['@identifier', 'support.function.name'],
            [';', 'punctuation', '@pop'],
            ['(?=})', { token: '', next: '@pop' }], // missing semicolon
            ['{', { token: 'punctuation.curly', bracket: '@open', switchTo: '@selectorbody' }],
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

        controlstatement: [
            ['[@](if|else|for|while|each|media)', { token: 'keyword.flow.control.at-rule', next: '@controlstatementdeclaration' }],
        ],

        controlstatementdeclaration: [
            ['(in|from|through|if|to)\\b', { token: 'keyword.flow.control.at-rule' }],
            { include: '@term' },
            ['{', { token: 'punctuation.curly', bracket: '@open', switchTo: '@selectorbody' }],
        ],

        functionbody: [
            ['[@](return)', { token: TOKEN_AT_KEYWORD }],
            { include: '@variabledeclaration' },
            { include: '@term' },
            { include: '@controlstatement' },
            [';', 'punctuation'],
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