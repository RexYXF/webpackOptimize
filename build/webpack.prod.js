const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const webpack = require('webpack')
//压缩代码(js和css同时使用)
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

//webpack的配置文件遵循着CommonJS规范
module.exports = merge(baseConfig, {
  //是否进行压缩混淆
  mode: 'production',//(默认)
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  //devtool: 'cheap-module-source-map', //会多一个js.map,但体积变小,但很少使用
  plugins: [
    new webpack.DefinePlugin({ //定义环境变量
      IS_DEV: 'false',
      // test: '1+1',  //DefinePlugin会解析定义的环境变量表达式,当成js执行 
      // test2: '"zs"' //这才是字符串
    })
  ]
})