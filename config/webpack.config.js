// import terserWebpack from 'terser-webpack-plugin'
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const path = require('node:path');
const config =(env,argv)=> {
    const configuration = {
        mode: argv.mode,
        entry:{
            popup:path.resolve(__dirname, '../src/popup/main.js'),
            contentScript: path.resolve(__dirname, '../src/contentScript/index.js'),
            background: path.resolve(__dirname, '../src/background/index.js'),
        },
    }
    console.log(argv)
    if(argv?.mode === 'development'){
        configuration.devtool = 'inline-source-map';
    }
    if(argv?.mode === 'production'){
        configuration.optimization={
            minimize: true,
            minimizer:[
               new TerserPlugin({
                   minify: TerserPlugin.uglifyJsMinify,
                   terserOptions:{
                       // compress:{
                       //     drop_console:true
                       // },
                       output: {
                           comments: false,  // 移除注释
                       },
                   }
               })
            ]
        }
    }
    return merge(common,configuration)
}
module.exports = config;