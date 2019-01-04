const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.config.base')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const utils = require('./utils')
const shouldUseSourceMap = utils.devtool ? true : false
const shouldDropDebugger = process.env.NODE_ENV === 'production' ? true : false
const shouldDropConsole = process.env.NODE_ENV === 'production' ? true : false

module.exports = merge(base, {
  output: {
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
    new CleanPlugin([path.resolve(__dirname, '..', 'dist/*')], {
      allowExternal: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
  optimization: {
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
