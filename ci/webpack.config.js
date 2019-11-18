const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        "core": './ci/core.js',
        "editor.worker": './vscode/out-monaco-editor-core/esm/vs/editor/editor.worker.js',
        "json.worker": 'monaco-json/release/esm/json.worker',
        "css.worker": 'monaco-css/release/esm/css.worker',
        "html.worker": 'monaco-html/release/esm/html.worker',
        "ts.worker": 'monaco-typescript/release/esm/ts.worker',
    },
    output: {
        globalObject: 'self',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            'monaco-editor-core/esm/vs/editor/editor.worker': path.resolve(__dirname, '../vscode/out-monaco-editor-core/esm/vs/editor/editor.worker.js'),
            'monaco-editor-core': path.resolve(__dirname, '../vscode/out-monaco-editor-core/esm/vs/editor/editor.main.js'),
        }
    },
    stats: {
        all: false,
        modules: true,
        maxModules: 0,
        errors: true,
        warnings: true,
        // our additional options
        moduleTrace: true,
        errorDetails: true,
        chunks: true
    }
};
