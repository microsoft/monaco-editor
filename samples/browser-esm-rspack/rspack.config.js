const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
	context: __dirname,
	entry: {
		main: './index.js'
	},
	builtins: {
		html: [
			{
				template: './index.html'
			}
		]
	},
	plugins: [
		new MonacoWebpackPlugin({
			languages: ['typescript', 'javascript', 'css']
		})
	]
};
