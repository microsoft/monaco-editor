/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as webpack from "webpack";
import * as path from "path";
import * as HtmlBundlerPlugin from "html-bundler-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import * as CopyPlugin from "copy-webpack-plugin";

const r = (file: string) => path.resolve(__dirname, file);

module.exports = {
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
				oneOf: [
					{
						resourceQuery: /raw/,
						type: "asset/source",
					},
					{
						test: /\.css$/,
						use: ["css-loader"],
					},
					{
						test: /\.scss$/,
						use: ["css-loader", "sass-loader"],
					},
					{
						test: /\.tsx?$/,
						loader: "ts-loader",
						options: { transpileOnly: true },
					},
				],
			},
			{ test: /\.txt$/i, type: "asset/source" },
			{
				test: /\.(jpe?g|png|gif|eot|ttf|svg|woff|woff2|md)$/i,
				type: "asset/resource",
				generator: {
					filename: "asset/[name][ext]",
				},
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				YEAR: JSON.stringify(new Date().getFullYear()),
			},
		}),
		new CleanWebpackPlugin(),
		new HtmlBundlerPlugin({
			entry: {
				// define templates as entry points here,
				// all source script and style files are referenced in html
				index: "src/website/pages/home/index.html",
				playground: "src/website/pages/playground/index.html",
				playgroundRunner:
					"src/website/pages/playground/playgroundRunner.html",
				docs: "src/website/pages/docs/index.html",
				monarch: "src/website/pages/monarch/index.html",
			},
			js: {
				filename: "js/[name].[contenthash:8].js",
				//inline: true, // inline compiled JS into HTML
			},
			css: {
				filename: "css/[name].[contenthash:8].css",
				//inline: true, // inline compiled CSS into HTML
			},
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
