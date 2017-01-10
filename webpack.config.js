'use strict';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const config = require('./config/default.json');

const distPath = path.join(__dirname, 'web', 'dist');
const srcPath = path.join(__dirname, 'web', 'src');

module.exports = {
    devServer: {
        contentBase: distPath,
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        colors: true,
        port: 1337
    },
    devtool: 'source-map',
    entry: [
        path.resolve(srcPath, 'index.jsx'),
    ],
    output: {
        path: distPath,
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
                from: path.resolve(srcPath, 'assets'),
                to: path.resolve(distPath, 'assets')
            }
        ]),
        new ExtractTextPlugin('styles.css'),
        new FaviconsWebpackPlugin({
            logo: path.resolve(srcPath, 'favicon', 'favicon.png'),
            title: config.APP_TITLE
        }),
        new HtmlWebpackPlugin({
            title: config.APP_TITLE,
            minify: {}
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
