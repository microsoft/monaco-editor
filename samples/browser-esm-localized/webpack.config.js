const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		app: './index.js',
		'editor.worker': '../../out/monaco-editor/esm/vs/editor/editor.worker.start.js',
		'json.worker': '../../out/monaco-editor/esm/vs/language/json/json.worker.js',
		'css.worker': '../../out/monaco-editor/esm/vs/language/css/css.worker.js',
		'html.worker': '../../out/monaco-editor/esm/vs/language/html/html.worker.js',
		'ts.worker': '../../out/monaco-editor/esm/vs/language/typescript/ts.worker.js'
	},
	output: {
		globalObject: 'self',
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.ttf$/,
				use: ['file-loader']
			}
		]
	}
};
