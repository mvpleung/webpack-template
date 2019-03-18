/*
 * @Desc: 路径管理
 * @Author: Eleven
 * @Date: 2018-12-19 10:21:05
 * @Last Modified by: Eleven
 * @Last Modified time: 2018-12-21 18:33:43
 */

const resolveApp = require('./utils').resolveApp

module.exports = {
  appBuild: resolveApp('build'),
  appConfig: resolveApp('config'),
  appDist: resolveApp('dist'),
  appWatch: resolveApp('dist-watch'),
  appSrc: resolveApp('src'),
  appAssets: resolveApp('src/assets'),
  appConstant: resolveApp('src/constant'),
  appService: resolveApp('src/service'),
  appPages: resolveApp('src/pages'),
  appCommon: resolveApp('src/common'),
  appComponents: resolveApp('src/components'),
  appUtils: resolveApp('src/utils'),
}
