
declare module monaco.languages.typescript {

    enum ModuleKind {
        None = 0,
        CommonJS = 1,
        AMD = 2,
        UMD = 3,
        System = 4,
        ES2015 = 5,
    }
    enum JsxEmit {
        None = 0,
        Preserve = 1,
        React = 2,
    }
    enum NewLineKind {
        CarriageReturnLineFeed = 0,
        LineFeed = 1,
    }

    enum ScriptTarget {
        ES3 = 0,
        ES5 = 1,
        ES2015 = 2,
        ES2016 = 3,
        ES2017 = 4,
        ESNext = 5,
        Latest = 5,
    }

    export enum ModuleResolutionKind {
        Classic = 1,
        NodeJs = 2,
    }

    type CompilerOptionsValue = string | number | boolean | (string | number)[] | string[];
    interface CompilerOptions {
        allowJs?: boolean;
        allowSyntheticDefaultImports?: boolean;
        allowUnreachableCode?: boolean;
        allowUnusedLabels?: boolean;
        alwaysStrict?: boolean;
        baseUrl?: string;
        charset?: string;
        declaration?: boolean;
        declarationDir?: string;
        disableSizeLimit?: boolean;
        emitBOM?: boolean;
        emitDecoratorMetadata?: boolean;
        experimentalDecorators?: boolean;
        forceConsistentCasingInFileNames?: boolean;
        importHelpers?: boolean;
        inlineSourceMap?: boolean;
        inlineSources?: boolean;
        isolatedModules?: boolean;
        jsx?: JsxEmit;
        lib?: string[];
        locale?: string;
        mapRoot?: string;
        maxNodeModuleJsDepth?: number;
        module?: ModuleKind;
        moduleResolution?: ModuleResolutionKind;
        newLine?: NewLineKind;
        noEmit?: boolean;
        noEmitHelpers?: boolean;
        noEmitOnError?: boolean;
        noErrorTruncation?: boolean;
        noFallthroughCasesInSwitch?: boolean;
        noImplicitAny?: boolean;
        noImplicitReturns?: boolean;
        noImplicitThis?: boolean;
        noUnusedLocals?: boolean;
        noUnusedParameters?: boolean;
        noImplicitUseStrict?: boolean;
        noLib?: boolean;
        noResolve?: boolean;
        out?: string;
        outDir?: string;
        outFile?: string;
        preserveConstEnums?: boolean;
        project?: string;
        reactNamespace?: string;
        jsxFactory?: string;
        removeComments?: boolean;
        rootDir?: string;
        rootDirs?: string[];
        skipLibCheck?: boolean;
        skipDefaultLibCheck?: boolean;
        sourceMap?: boolean;
        sourceRoot?: string;
        strictNullChecks?: boolean;
        suppressExcessPropertyErrors?: boolean;
        suppressImplicitAnyIndexErrors?: boolean;
        target?: ScriptTarget;
        traceResolution?: boolean;
        types?: string[];
        /** Paths used to compute primary types search locations */
        typeRoots?: string[];
        [option: string]: CompilerOptionsValue | undefined;
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

        /**
         * Configure if all existing models should be eagerly sync'd
         * to the worker on start or restart.
         */
        setEagerModelSync(value: boolean): void;
    }

    export var typescriptDefaults: LanguageServiceDefaults;
    export var javascriptDefaults: LanguageServiceDefaults;

    export var getTypeScriptWorker: () => monaco.Promise<any>;
    export var getJavaScriptWorker: () => monaco.Promise<any>;
}
