import { languages } from '../../fillers/monaco-editor-core';
export declare const conf: languages.LanguageConfiguration;
export declare const language: {
    defaultToken: string;
    tokenPostfix: string;
    keywords: string[];
    operators: string[];
    symbols: RegExp;
    escapes: RegExp;
    digits: RegExp;
    octaldigits: RegExp;
    binarydigits: RegExp;
    hexdigits: RegExp;
    regexpctl: RegExp;
    regexpesc: RegExp;
    tokenizer: {
        root: ((string | RegExp)[] | {
            include: string;
        })[];
        common: ((string | RegExp)[] | (RegExp | {
            cases: {
                '@keywords': string;
                '@default': string;
            };
        })[] | {
            include: string;
        } | (RegExp | {
            token: string;
            bracket: string;
            next: string;
        })[] | (RegExp | {
            cases: {
                '@operators': string;
                '@default': string;
            };
        })[])[];
        whitespace: (string | RegExp)[][];
        comment: (string | RegExp)[][];
        jsdoc: (string | RegExp)[][];
        regexp: ((string | RegExp)[] | (RegExp | (string | {
            token: string;
            next: string;
        })[])[] | (RegExp | (string | {
            token: string;
            bracket: string;
            next: string;
        })[])[])[];
        regexrange: ((string | RegExp)[] | (RegExp | {
            token: string;
            next: string;
            bracket: string;
        })[])[];
        string_double: (string | RegExp)[][];
        string_single: (string | RegExp)[][];
        string_backtick: ((string | RegExp)[] | (RegExp | {
            token: string;
            next: string;
        })[])[];
        bracketCounting: ((string | RegExp)[] | {
            include: string;
        })[];
    };
};
