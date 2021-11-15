const MonacoWebpackPlugin = require('../out/index.js');
const path = require('path');

module.exports = {
	mode: 'development',
	entry: './index.js',
	context: __dirname,
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.js'
	},
	resolve: {
		alias: {
			'monaco-editor': path.resolve(__dirname, '../../release')
		}
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
	},
	plugins: [
		new MonacoWebpackPlugin({
			monacoEditorPath: path.resolve(__dirname, '../../release')
		})
	]
};
