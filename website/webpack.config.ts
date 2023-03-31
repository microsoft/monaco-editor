/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as webpack from "webpack";
import * as path from "path";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
import * as CopyPlugin from "copy-webpack-plugin";

const r = (file: string) => path.resolve(__dirname, file);

module.exports = {
	entry: {
		index: r("src/website/index.tsx"),
		playgroundRunner: r("src/runner/index.ts"),
		monacoLoader: r("src/website/monaco-loader-chunk.ts"),
	},
	optimization: {
		runtimeChunk: "single",
	},
	output: {
		path: r("dist"),
		devtoolModuleFilenameTemplate: "file:///[absolute-resource-path]",
	},
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
	},
	devtool: "source-map",
	devServer: {
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods":
				"GET, POST, PUT, DELETE, PATCH, OPTIONS",
			"Access-Control-Allow-Headers":
				"X-Requested-With, content-type, Authorization",
		},
		allowedHosts: "all",
		watchFiles: [],
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					/*"style-loader"*/ MiniCssExtractPlugin.loader,
					"css-loader",
				],
			},
			{
				test: /\.scss$/,
				use: [
					/*"style-loader",*/ MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader",
				],
			},
			{
				test: /\.(jpe?g|png|gif|eot|ttf|svg|woff|woff2|md)$/i,
				loader: "file-loader",
			},
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				options: { transpileOnly: true },
			},
			{ test: /\.txt$/i, use: "raw-loader" },
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				YEAR: JSON.stringify(new Date().getFullYear()),
			},
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css",
		}),
		new HtmlWebpackPlugin({
			chunks: ["monacoLoader", "index"],
			templateContent: getHtml(),
			chunksSortMode: "manual",
		}),
		new HtmlWebpackPlugin({
			chunks: ["index"],
			filename: "playground.html",
			templateContent: getHtml(),
		}),
		new HtmlWebpackPlugin({
			chunks: ["playgroundRunner"],
			filename: "playgroundRunner.html",
			templateContent: getHtml(),
		}),
		new HtmlWebpackPlugin({
			chunks: ["index"],
			filename: "docs.html",
			templateContent: getHtml(),
		}),
		new HtmlWebpackPlugin({
			chunks: ["index"],
			filename: "monarch.html",
			templateContent: getHtml(),
		}),
		new CopyPlugin({
			patterns: [{ from: "./static", to: "./" }],
		}),
		new CopyPlugin({
			patterns: [{ from: "./typedoc/dist", to: "./typedoc/" }],
		}),
		new CopyPlugin({
			patterns: [
				{
					from: "./node_modules/monaco-editor/",
					to: "./node_modules/monaco-editor/",
					// This disables minification for js files
					info: { minimized: true },
				},
			],
		}),
		new CopyPlugin({
			patterns: [
				{
					from: "../node_modules/monaco-editor-core/",
					to: "./node_modules/monaco-editor-core/",
					// This disables minification for js files
					info: { minimized: true },
				},
			],
		}),
		new CopyPlugin({
			patterns: [{ from: "../out/languages/", to: "./out/languages/" }],
		}),
	],
} as webpack.Configuration;

function getHtml(): string {
	return `
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Monaco Editor</title>
	</head>
	<body>
	</body>
</html>`;
}
