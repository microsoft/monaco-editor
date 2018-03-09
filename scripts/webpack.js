const path = require('path');
const webpack = require('webpack');

const REPO_ROOT = path.resolve(__dirname, '..');

exports.createWebpackConfig = function (isDev) {
	let targetFolder = isDev ? './release/dev' : './release/min';
	let mode = isDev ? 'development' : 'production';

	return {
		entry: {
			"monaco.contribution": './release/esm/monaco.contribution',
			"cssMode": './release/esm/cssMode',
			"cssWorker": './release/esm/cssWorker'
		},
		output: {
			filename: '[name].js',
			path: path.resolve(REPO_ROOT, targetFolder),
			libraryTarget: "amd"
		},
		mode: mode,
		plugins: [
			new webpack.optimize.LimitChunkCountPlugin({
				maxChunks: 1,
			})
		],
	};
};
