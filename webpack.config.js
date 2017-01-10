'use strict';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const config = require('./config/default.json');

const appPath = path.join(__dirname, 'web');

module.exports = {
    devServer: {
        contentBase: path.resolve(appPath, 'dist'),
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        colors: true,
        port: 1337
    },
    devtool: 'source-map',
    entry: [
        path.resolve(appPath, 'src', 'index.jsx'),
    ],
    output: {
        path: path.resolve(appPath, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loaders: ['react-hot', 'babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css!sass')
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.resolve(appPath, 'src', 'assets'),
                to: path.resolve(appPath, 'dist', 'assets')
            }
        ]),
        new ExtractTextPlugin('styles.css'),
        new HtmlWebpackPlugin({
            title: config.APP_TITLE,
            minify: {}
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
