const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.config.base')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const paths = require('./paths')
const utils = require('./utils')
const shouldUseSourceMap = utils.devtool ? true : false
const shouldDropDebugger = process.env.NODE_ENV === 'production' ? true : false
const shouldDropConsole = process.env.NODE_ENV === 'production' ? true : false

module.exports = merge(base, {
  output: {
    path: paths.appWatch,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].js',
  },
  stats: {
    chunks: false,
    children: false,
    modules: false,
    entrypoints: false,
  },
  plugins: [
    ...utils.getHtmlWebpackPluginsProd(),
    new CleanPlugin([path.resolve(__dirname, '..', 'dist-watch/*')], {
      allowExternal: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
      chunkFilename: 'static/css/[name].css',
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
  optimization: {
    runtimeChunk: true, // 抽取运行时代码
    splitChunks: {
      chunks: 'all',
      name: false,
      // 缓存组
      cacheGroups: {
        vendor: { // 主要模块
          test: /[\\/]node_modules[\\/](moment)[\\/]/,
          name: 'vendor',
          chunks: 'all',
          maxAsyncRequests: 5,  // 当按需加载时，并行请求的最大数量
          priority: 10, // 缓存组打包的先后优先级
          enforce: true,  // // 如果cacheGroup中没有设置minSize，则据此判断是否使用上层的minSize，true：则使用0，false：使用上层minSize
        },
        common: { // 次要模块
          test: /[\\/]node_modules[\\/]/,
          name: 'common',
          chunks: 'all',
          maxAsyncRequests: 5,
          priority: 9,
          enforce: true,
          reuseExistingChunk: true, // 设置是否重用该chunk
        },
      },
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: shouldUseSourceMap,
        uglifyOptions: {
          compress: {
            warnings: false, // 在删除没有用到的代码时不输出警告
            drop_debugger: shouldDropDebugger, // 删除debugger
            drop_console: shouldDropConsole, // 删除console
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
          },
          output: {
            beautify: false, // 不美化输出
            comments: false, // 删除所有的注释
            // https://github.com/facebookincubator/create-react-app/issues/2488
            ascii_only: true,
          },
        },
      }),
    ],
  },
})
