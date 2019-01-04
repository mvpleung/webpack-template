const webpack = require('webpack')
const merge = require('webpack-merge')
const bodyParser = require('body-parser')
const base = require('./webpack.config.base')
const utils = require('./utils')
const paths = require('./paths')
const packageJson = require('../package')

module.exports = merge(base, {
  devServer: {
    contentBase: paths.appDist,
    // openPage: 'index.html', // 指定默认启动浏览器时打开的页面
    // index: path.resolve(__dirname, '..', 'src/views/index/index.html'), // 指定首页位置
    host: 'localhost',  // '0.0.0.0' 可以通过外网访问
    port: 3000,
    inline: true,
    hot: true,
    open: true,
    compress: true,
    disableHostCheck: true,
    quiet: false,
    clientLogLevel: 'none',
    watchContentBase: true,
    stats: {
      chunks: false,
      children: false,
      modules: false,
      entrypoints: false,
    },
    historyApiFallback: {
      disableDotRule: true,
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    proxy: packageJson.proxy, // 代理
    before(app) {
      //  可以做本地代理
      app.use(bodyParser.urlencoded({ extended: true }))
    },
  },
  plugins: [...utils.getHtmlWebpackPluginsDev(), new webpack.NamedModulesPlugin()],
})
