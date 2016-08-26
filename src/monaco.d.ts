
declare module monaco.languages.typescript {

    export enum ModuleKind {
        None = 0,
        CommonJS = 1,
        AMD = 2,
        UMD = 3,
        System = 4,
        ES6 = 5,
        ES2015 = 5,
    }

    export enum JsxEmit {
        None = 0,
        Preserve = 1,
        React = 2,
    }

    export enum NewLineKind {
        CarriageReturnLineFeed = 0,
        LineFeed = 1,
    }

    export enum ScriptTarget {
        ES3 = 0,
        ES5 = 1,
        ES6 = 2,
        ES2015 = 2,
        Latest = 2,
    }

    export enum ModuleResolutionKind {
        Classic = 1,
        NodeJs = 2,
    }

    interface CompilerOptions {
        allowNonTsExtensions?: boolean;
        charset?: string;
        declaration?: boolean;
        diagnostics?: boolean;
        emitBOM?: boolean;
        help?: boolean;
        init?: boolean;
        inlineSourceMap?: boolean;
        inlineSources?: boolean;
        jsx?: JsxEmit;
        reactNamespace?: string;
        listFiles?: boolean;
        locale?: string;
        mapRoot?: string;
        module?: ModuleKind;
        newLine?: NewLineKind;
        noEmit?: boolean;
        noEmitHelpers?: boolean;
        noEmitOnError?: boolean;
        noErrorTruncation?: boolean;
        noImplicitAny?: boolean;
        noLib?: boolean;
        noResolve?: boolean;
        out?: string;
        outFile?: string;
        outDir?: string;
        preserveConstEnums?: boolean;
        project?: string;
        removeComments?: boolean;
        rootDir?: string;
        sourceMap?: boolean;
        sourceRoot?: string;
        suppressExcessPropertyErrors?: boolean;
        suppressImplicitAnyIndexErrors?: boolean;
        target?: ScriptTarget;
        version?: boolean;
        watch?: boolean;
        isolatedModules?: boolean;
        experimentalDecorators?: boolean;
        emitDecoratorMetadata?: boolean;
        moduleResolution?: ModuleResolutionKind;
        allowUnusedLabels?: boolean;
        allowUnreachableCode?: boolean;
        noImplicitReturns?: boolean;
        noFallthroughCasesInSwitch?: boolean;
        forceConsistentCasingInFileNames?: boolean;
        allowSyntheticDefaultImports?: boolean;
        allowJs?: boolean;
        noImplicitUseStrict?: boolean;
        disableSizeLimit?: boolean;
        [option: string]: string | number | boolean;
    }

    export interface DiagnosticsOptions {
        noSemanticValidation?: boolean;
        noSyntaxValidation?: boolean;
    }

    export interface LanguageServiceDefaults {
        /**
         * Add an additional source file to the language service. Use this
         * for typescript (definition) files that won't be loaded as editor
         * document, like `jquery.d.ts`.
         *
         * @param content The file content
         * @param filePath An optional file path
         * @returns A disposabled which will remove the file from the
         * language service upon disposal.
         */
        addExtraLib(content: string, filePath?: string): IDisposable;

        /**
         * Set TypeScript compiler options.
         */
        setCompilerOptions(options: CompilerOptions): void;

        /**
         * Configure whether syntactic and/or semantic validation should
         * be performed
         */
        setDiagnosticsOptions(options: DiagnosticsOptions): void;

        /**
         * Configure when the worker shuts down. By default that is 2mins.
         *
         * @param value The maximun idle time in milliseconds. Values less than one
         * mean never shut down.
         */
        setMaximunWorkerIdleTime(value: number): void;
    }

    export var typescriptDefaults: LanguageServiceDefaults;
    export var javascriptDefaults: LanguageServiceDefaults;

    export var getTypeScriptWorker: () => monaco.Promise<any>;
    export var getJavaScriptWorker: () => monaco.Promise<any>;
}
