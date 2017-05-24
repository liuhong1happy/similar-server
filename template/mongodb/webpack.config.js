var fs = require('fs');
var path = require('path');
var webpcak = require('webpack');

module.exports = {
    entry: [
        'babel-polyfill','./index.js'
    ],
    output: {
        path: path.resolve(__dirname, 'bin'),
        filename: 'www'
    },
    target: 'node',
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: [
                path.resolve(__dirname, "node_modules"),
            ]
        }]
    },
    resolve: {
        extensions: ['.js', '.json']
    }
}