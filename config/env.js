/* 
 * @Desc: 编译环境变量
 * @Author: Eleven 
 * @Date: 2018-12-18 17:32:40 
 * @Last Modified by: Eleven
 * @Last Modified time: 2019-04-27 01:57:43
 */

module.exports = {
  development: {  // 本地调试环境
    publicPath: '/',
    devtool: 'cheap-module-source-map', // cheap-source-map不适用terser-webpack-plugin压缩插件
  },
  test: { // 测试环境
    publicPath: '//static2.test.ximalaya.com/sr012018/card-voucher-2019/last/dist/',
    devtool: 'cheap-module-source-map',
  },
  production: {  // 生产环境
    publicPath: '//s1.xmcdn.com/sr012018/card-voucher-2019/last/dist/',
    devtool: false,
  },
}
