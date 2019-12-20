const MonacoWebpackPlugin = require('../out/index.js');
const path = require('path');

const ASSET_PATH = 'http://localhost:8088/monaco-editor-webpack-plugin/test/dist/';

module.exports = {
    mode: 'development',
    entry: './index.js',
    context: __dirname,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
        publicPath: ASSET_PATH
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.ttf$/,
            use: ['file-loader']
        }]
    },
    plugins: [
        new MonacoWebpackPlugin()
    ]
};
