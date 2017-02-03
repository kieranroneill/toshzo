'use strict';

const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const strings = require('./config/strings.json');

const distPath = path.join(__dirname, 'public', 'dist');
const srcPath = path.join(__dirname, 'public', 'src');

module.exports = {
    resolve: {
        extensions: ['', '.js', '.jsx', '.scss']
    },

    // Production specific.
    devtool: 'cheap-module-source-map',
    entry: path.resolve(srcPath, 'index.jsx'),
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?.*$|$)/,
                loader: 'file-loader'
            },
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /.jsx?$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
            }
        ]
    },
    output: {
        path: distPath,
        filename: 'bundle.js'
    },
    plugins: [
        new CopyWebpackPlugin([{ from: path.resolve(srcPath, 'assets'), to: path.resolve(distPath, 'assets') }]),
        new ExtractTextPlugin('styles.css'),
        new FaviconsWebpackPlugin({
            logo: path.resolve(srcPath, 'favicon.png'),
            title: strings.APP_TITLE
        }),
        new HtmlWebpackPlugin({
            title: strings.APP_TITLE,
            inject: 'body',
            template: path.resolve(srcPath, 'index.hbs'),
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                minifyJS: true,
                minifyCSS: true
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: false,
            mangle: false
        })
    ],
    postcss: () => [ autoprefixer({ browsers: ['last 3 versions'] }) ],
    sassLoader: { outputStyle: 'compressed' }
};
