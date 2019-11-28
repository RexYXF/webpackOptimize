const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//打包时自动删除dist再创建dist文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin') 
//打包时复制并创建不需要打包的文件夹
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
//将css提取到独立文件中 只能在webpack4中使用
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//向html插入js,一定要放在HtmlWebpackPlugin插件之后
const AddAssetHtmlWabpackPlugiin = require('add-asset-html-webpack-plugin')
//分析模块图
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin


//webpack的配置文件遵循着CommonJS规范
module.exports = {
  //性能提升:代码拆分
  optimization: {
    splitChunks: {
      chunks: 'all',  //默认值为async 表示只会对异步加载的模块进行代码分割   initial|all
      minSize: 30000, //模块大于30KB才拆分
      maxSize: 0, //模块最大没有上限
      minChunks: 1, //模块最少引用一次才会被拆分
      maxAsyncRequests: 5, //异步加载时同时发送的请求数量最大不能超过5,超过5的部分不拆分
      maxInitialRequests: 3, //页面初始化时同时发送的请求数量最大不能超过4,超过3的部分不拆分
      automaticNameDelimiter: '~', //默认的连接符
      name: true, //拆分的chunk名,设为true表示根据模块名和CacheGroup的Key来自动生成,使用上面的连接符来连接
      cacheGroups: { //缓存组配置,上面配置读取完成后进行拆分,如果需要把多个模块拆分到一个文件,就需要缓存,所以命名为缓存组
        vendors: { //自定义缓存组名
          test: /[\\/]node_modules[\\/]/, //检查node_modules目录,只要模块在该目录里,就以此缓存组命名
          priority: -10, //权重-10,决定了哪个组优先匹配
          // filename: 'vendors.js'
        },
        default: {  //默认缓存组名
          minChunks: 2, //最少引用两次才会被拆分
          priority: -20,  //权重-20
          reuseExistingChunk: true //如果主入口中引入了两个模块,其中一个正好也引用了后一个,就会直接复用,无需引用两次
        },
      }
    }
  },
  entry: {
    main: './src/main.js'
    //main: './src/main.react.js'
  },
  // entry: {
  //   main: './src/main.js',
  //   other: './src/other.js'
  // },
  output: {
    //path.resolve() : 解析当前相对路径的绝对路径
    //path: path.resolve('./dist/'),
    //path: path.resolve(__dirname,'./dist/'),
    path: path.join(__dirname,'..','./dist/'), //绝对路径
    // filename: 'bundle.js'
    //合理利用浏览器缓存,不修改js就读缓存,修改就读新的
    filename: '[name].[contenthash:8].bundle.js',
    publicPath: '/'
  },
  //开启监视模式,此时执行webpack指令进行打包会监视文件改变自动打包
  // watch: true,
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      //chunks: ['index','other'] //entry对应的
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'other.html',
    //   template: './src/other.html',
    //   chunks: ['other'] //entry对应的
    // }),
    //new CleanWebpackPlugin(), //打包时自动删除dist再创建dist文件夹,但不能和dllplugin公用
    new CopyWebpackPlugin([
      { 
        from: path.join(__dirname,'..','assets'), //绝对路径
        to: './assets' 
      }
    ]),
    //new webpack.BannerPlugin('yuxufeng'), //加版权注释
    //将库自动加载到每个模块
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery'
    // }),
    new MiniCssExtractPlugin({ 
      //placeholders
      filename: '[name].css'
    }),
    //性能提升:忽略插件(例:忽略moment里的国际化语言包,再手动引入需要的语言包)
    new webpack.IgnorePlugin(/\.\/locale$/,/moment$/),
    // //性能提升:手动引入manifest配置文件
    // new webpack.DllReferencePlugin({
    //   manifest: path.resolve(__dirname,'../dist/manifest.json')
    // }),
    // //性能提升:自动引入dll的文件
    // new AddAssetHtmlWabpackPlugiin({
    //   filepath: path.resolve(__dirname, '../dist/vue_dll.js')
    //   //filepath: path.resolve(__dirname, '../dist/react_dll.js')
    // }),
    //new BundleAnalyzerPlugin()
  ],
  module: {
    //性能提升:不解析哪些模块
    noParse: /jquery|bootstrap/,
    rules: [
      {
        test: /\.css$/,
        //webpack读取loader时 是从右到左的读取,会将css文件先交给最右侧的loader来处理
        //loader的执行顺序是管道的方式链式调用
        //css-loader: 解析css文件
        //style-loader: 将解析出来的结果,放到html中,使其生效
        // use: ['style-loader','css-loader'],
        use: [MiniCssExtractPlugin.loader,'css-loader','postcss-loader']
      },
      {
        test: /\.less$/,
        //use: ['style-loader','css-loader','less-loader'],
        use: [MiniCssExtractPlugin.loader,'css-loader','postcss-loader','less-loader']
      },
      {
        test: /\.s(a|c)ss$/,
        //use: ['style-loader','css-loader','sass-loader'],
        use: [MiniCssExtractPlugin.loader,'css-loader','postcss-loader','sass-loader']
      },
      {
        test: /\.(jpg|jpeg|png|bmp|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 5 * 1024, //b为单位 5kb以下的base64展示
            outputPath: 'images', //打包输出到指定文件夹中
            name: '[name]-[hash:6].[ext]' //图片保存的名字,name原图片名,ext拓展名,hash:4表示哈希前4位
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|svg|ttf)$/,
        use: 'url-loader'
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          // options: {
          //   presets: ['@babel/env'],
          //   //支持更高级的es6的语法
          //   plugins: [
          //     '@babel/plugin-proposal-class-properties',
          //     '@babel/plugin-transform-runtime'
          //   ]
          // }
        },
        exclude: /node_modules/,
        include: path.resolve(__dirname,'../src')
      },
      {
        test: /\.(htm|html)$/,
        use: 'html-withimg-loader' //处理html中img标签的图片资源
      },
      // {
      //   //用来解析jQuery模块的绝对路径
      //   test: require.resolve('jquery'),
      //   use: {
      //     loader: 'expose-loader', //注入到全局
      //     options: '$'
      //   }
      // }
    ]
  }
}