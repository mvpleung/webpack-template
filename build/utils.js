/*
 * @Desc: 工具函数
 * @Author: Eleven
 * @Date: 2018-12-18 17:32:30
 * @Last Modified by: Eleven
 * @Last Modified time: 2019-04-15 22:13:52
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const env = require('../config/env')
const NODE_ENV = process.env.NODE_ENV
const appDirectory = fs.realpathSync(process.cwd())
const publicPath = env[NODE_ENV].publicPath
const devtool = env[NODE_ENV].devtool
const isWatch = process.env.IS_WATCH === 'true'

/**
 * 解析路径
 * @param {String} relativePath 相对路径
 */
const resolveApp = (relativePath) => {
  return path.resolve(appDirectory, relativePath)
}

/**
 * 获取文件
 * @param {String} filesPath 文件目录
 * @returns {Object} 文件集合(文件名: 文件路径)
 */
const getFiles = filesPath => {
  let files = glob.sync(filesPath)
  let obj = {}
  let filePath, basename, extname

  for (let i = 0; i < files.length; i++) {
    filePath = files[i]
    extname = path.extname(filePath) // 扩展名 eg: .html
    basename = path.basename(filePath, extname) // 文件名 eg: index
    // eg: { index: '/src/views/index/index.js' }
    obj[basename] = path.resolve(appDirectory, filePath)
  }
  return obj
}

/**
 * 打包入口
 *  1.允许文件夹层级嵌套;
 *  2.入口js的名称不允许重名;
 */
const entries = getFiles('src/views/**/*.js')

/**
 * 页面的模版
 *  1.允许文件夹层级嵌套;
 *  2.html的名称不允许重名;
 */
const templates = getFiles('src/views/**/*.html')

/**
 * 获取entry入口，为了处理在某些时候，entry入口会加polyfill等:
 *  1.允许文件夹层级嵌套;
 *  2.入口的名称不允许重名;
 *
 * @returns {Object} entry 入口列表(对象形式)
 */
const getEntries = () => {
  let entry = {}

  for(let name in entries) {
    entry[name] = entries[name]
  }
  return entry
}

/**
 * 生成webpack.config.dev.js的plugins下new HtmlWebpackPlugin()配置
 * @returns {Array} new HtmlWebpackPlugin()列表
 */
const getHtmlWebpackPluginsDev = () => {
  let htmlWebpackPlugins = []
  let setting = null

  for(let name in templates) {
    setting = {
      filename: `${name}.html`,
      template: templates[name],
      inject: false, // js插入的位置，true/'head'/'body'/false
    }

    // (仅)有入口的模版自动引入资源
    if (name in getEntries()) {
      setting.chunks = [name]
      setting.inject = true
    }
    htmlWebpackPlugins.push(new HtmlWebpackPlugin(setting))
    setting = null
  }

  return htmlWebpackPlugins
}

/**
 * 生成webpack.config.prod.js的plugins下new HtmlWebpackPlugin()配置
 * @returns {Array} new HtmlWebpackPlugin()列表
 */
const getHtmlWebpackPluginsProd = () => {
  let htmlWebpackPlugins = []
  let setting = null

  for(let name in templates) {
    setting = {
      filename: `${name}.html`,
      template: templates[name],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: false, // js插入的位置，true/'head'/'body'/false
    }

    // (仅)有入口的模版自动引入资源
    if (name in getEntries()) {
      setting.chunks = ['manifest', 'vendor', 'common', name]
      setting.inject = true
    }
    htmlWebpackPlugins.push(new HtmlWebpackPlugin(setting))
    setting = null
  }

  return htmlWebpackPlugins
}


module.exports = {
  resolveApp,
  publicPath,
  devtool,
  isWatch,
  entries,
  getEntries,
  getHtmlWebpackPluginsDev,
  getHtmlWebpackPluginsProd,
}
