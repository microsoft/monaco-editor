const path = require("path");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: process.env.NODE_ENV,
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                ],
            },
            {
                test: /\.(png|jpg|gif|svg|woff2?|ttf|eot|otf)$/,
                use: [
                    {
                        loader: "file-loader",
                    },
                ],
            },
        ],
    },
    plugins: [
        new MonacoWebpackPlugin({
            languages: ["typescript", "javascript", "css"],
        }),
		new HtmlWebpackPlugin()
    ],
    devServer: {
        port: 4000,
		hot: process.env.NODE_ENV === 'development',
		open: true
    },
    devtool: process.argv.includes("--use-sourcemaps") ? "inline-source-map" : false,
};
