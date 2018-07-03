const MonacoWebpackPlugin = require('../index.js');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './index.js',
    context: __dirname,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    plugins: [
        new MonacoWebpackPlugin()
    ]
};
