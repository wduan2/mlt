const resolve = require('path').resolve;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// webpack build require absolute path
const BUILD_DIR = resolve(__dirname, 'dist');
const SRC_DIR = resolve(__dirname, 'src');
const PUBLIC_PATH = '/';

module.exports = {
    devtool: 'source-map',
    mode: 'development',
    entry: SRC_DIR + '/index.js',
    output: {
        filename: 'bundle.js',
        path: BUILD_DIR,
        publicPath: PUBLIC_PATH
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // generate the index.html
        new HtmlWebpackPlugin({
            title: 'mlt',
            template: SRC_DIR + '/index.ejs'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                cache: false,
                parallel: true,
                sourceMap: true
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
                include: SRC_DIR
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'style-loader', 'css-loader']
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', 'css']
    },
    // IMPORTANT: the Html-Webpack-Plugin WILL NOT write files to the local
    // file system when it is used by the Webpack-Development-Server
    devServer: {
        host: '0.0.0.0',
        disableHostCheck: true,
        contentBase: BUILD_DIR,
        compress: false,
        port: 9000,
        inline: false // no need when HotModuleReplacement is used
    }
};
