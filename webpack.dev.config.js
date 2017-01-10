'use strict';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const config = require('./lib/config/default.json');

const distPath = path.join(__dirname, 'public', 'dist');
const srcPath = path.join(__dirname, 'public', 'src');

module.exports = {
    devServer: {
        outputPath: 'http://localhost:' + config.PORT
    },
    devtool: 'source-map',
    entry: [
        path.resolve(srcPath, 'index.jsx'),
        'webpack-hot-middleware/client',
        'webpack/hot/dev-server'
    ],
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
    output: {
        filename: 'bundle.js',
        path: '/',
        publicPath: 'http://localhost:' + config.PORT + '/'
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
            minify: false
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['', '.js', '.jsx', '.map']
    }
};
