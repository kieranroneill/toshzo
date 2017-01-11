'use strict';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const config = require('./lib/config/default.json');

const distPath = path.join(__dirname, 'public', 'dist');
const srcPath = path.join(__dirname, 'public', 'src');

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: path.resolve(srcPath, 'index.jsx'),
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css!sass')
            }
        ]
    },
    output: {
        path: distPath,
        filename: 'bundle.js'
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
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                minifyJS: true,
                minifyCSS: true
            }
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
