const merge = require('webpack-merge') //合并相同的配置
const baseConfig = require('./webpack.base') //相同的配置文件
//引入webpack
const webpack = require('webpack')

//webpack的配置文件遵循着CommonJS规范
module.exports = merge(baseConfig, {
  mode: 'development',
  //开启监视模式,此时执行webpack指令进行打包会监视文件改变自动打包
  // watch: true,
  devServer: {
    open: true, //自动打开浏览器
    port: 3000, //端口号
    hot: true,  //开启热更新
    compress: true, //压缩
    // contentBase: './src'
    proxy: {
      // /api/getUserInfo
      // 当前端请求 /api 地址时,会将请求转发到
      // http://localhost:9999/api
      // 举例: 客服端现在请求时 /api/getUserInfo
      // 此时会将请求转发到 http://localhost:9999/api/getUserInfo
      // '/api': 'http://localhost:9999'
      '/api': {
        target: 'http://localhost:9999',
        //转发请求时不会携带 /api 重写成""
        //http://localhost:9999'/getUserInfo
        pathRewrite: {
          '^/api':''
        }
      }
    }
  },
  devtool: 'cheap-module-eval-source-map', //开发时使用,映射源码
  plugins: [
    new webpack.DefinePlugin({ //定义环境变量
      IS_DEV: 'true',
      // test: '1+1',  //DefinePlugin会解析定义的环境变量表达式,当成js执行 
      // test2: '"zs"' //这才是字符串
    })
  ]
})