const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const utils = require('./utils')
const paths = require('./paths')
const styleLoader = process.env.USE_STYLE_LOADER ? 'style-loader' : MiniCssExtractPlugin.loader

module.exports = {
  entry: utils.getEntries(),
  output: {
    path: paths.appDist,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].js',
    publicPath: utils.publicPath || '/',
  },
  devtool: utils.devtool,
  resolve: {
    extensions: ['.js', '.json', '.css', '.less', '.art'],
    alias: {
      zepto: utils.resolveApp('src/lib/zepto.min.js'),
      config: paths.appConfig,
      src: paths.appSrc,
      assets: paths.appAssets,
      constant: paths.appConstant,
      service: paths.appService,
      pages: paths.appPages,
      common: paths.appCommon,
      components: paths.appComponents,
      utils: paths.appUtils,
    },
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          attrs: ['link:href', 'img:src', 'img:data-src', 'audio:src'],
        },
      },
      {
        test: /\.(less|css)$/,
        use: [styleLoader, 'css-loader', 'postcss-loader', 'less-loader'],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: paths.appSrc,
        exclude: /node_modules/,
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.art$/,
        loader: 'art-template-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/assets/images/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/assets/media/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(ico)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'static/assets/images/[name].[hash:7].[ext]',
        },
      },
      {
        // require.resolve()是nodejs用来查找模块位置的方法,返回模块的入口文件.
        test: require.resolve('../src/lib/zepto.min.js'),
        loader: 'exports-loader?window.Zepto!script-loader',
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'zepto',
      Zepto: 'zepto',
      moment: 'moment',
    }),
    new webpack.DefinePlugin({
      BUILD_ENV: JSON.stringify(process.env.NODE_ENV), // 将环境变量注入到应用中
      IS_MOCK: JSON.stringify(process.env.IS_MOCK),
    }),
  ],
}
