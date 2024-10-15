// import {resolve} from 'node:path';
// import {VueLoaderPlugin} from "vue-loader";
// import htmlWebpackPlugin from 'html-webpack-plugin';
// import CopyWebpackPlugin from 'copy-webpack-plugin';
const {resolve} = require('node:path');
const {VueLoaderPlugin} = require("vue-loader");
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const IMAGE_TYPES = /\.(png|jpe?g|gif|svg)$/i;
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const fs = require('fs');
const common={
    output:  {
        path: resolve(__dirname, '../build'),
        filename: '[name].[contenthash].js',
        chunkFilename: 'js/[name].[contenthash].chunk.js',
        publicPath: '/',
        clean: true,  // 清理旧的输出文件
    },
    stats: {
        all: false,
        errors: true,
        builtAt: true,
        assets: true,
        excludeAssets: [IMAGE_TYPES],
    },
    plugins: [
        new VueLoaderPlugin(),
        new htmlWebpackPlugin({
            template: resolve(__dirname, '../src/popup/index.html'),
            filename: 'popup.html',
            chunks: ['popup']
        }),
        new CopyWebpackPlugin({
            patterns: [
                // {
                //     from: resolve(__dirname, '../src/manifest.json'),
                //     to: resolve(__dirname, '../build'),
                // },
                {
                    from: resolve(__dirname, '../src/assets'),
                    to: resolve(__dirname, '../build/assets'),
                },
            ],
        }),
        new WebpackManifestPlugin({
            fileName: 'manifest.json',
            generate: (seed, files) => {
                // 读取原始的 manifest.json 文件
                const manifest = JSON.parse(fs.readFileSync(resolve(__dirname, '../src/manifest.json'), 'utf-8'));
                console.log(files)
                // 查找并替换文件路径
                const fileMap = files.reduce((map, file) => {
                    map[file.name] = file.path;
                    return map;
                }, {});
                console.log(seed,'2222')
                // 替换 background 和 content script 的路径
                manifest.background.service_worker = fileMap['background.js'];
                manifest.content_scripts[0].js = [fileMap['contentScript.js']];

                return manifest;
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                        ],
                    },
                }
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader','css-loader'],
            },
        ],
    },
    resolve: {
        alias: {
            // vue$: 'vue/dist/vue.runtime.esm-bundler.js', // 减少打包体积 只要使用
            '@': resolve(__dirname, '../src'),
        },
    }
}
module.exports = common