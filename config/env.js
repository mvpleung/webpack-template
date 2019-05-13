/* 
 * @Desc: 编译环境变量（会自动注入process.env中）
 *  1.process.env.BUILD_ENV编译环境的key，可以是development/test/production等;
 *  2.NODE_ENV值必须是 development/test/production;
 * 
 * @Author: Eleven 
 * @Date: 2018-12-18 17:32:40 
 * @Last Modified by: Eleven
 * @Last Modified time: 2019-05-13 14:13:54
 */

module.exports = {
  development: {  // 本地调试环境
    NODE_ENV: 'development',  // 需要定义，有时插件内部依靠process.env.NODE_ENV值区分环境，去移除调试内容
    publicPath: '/',
    devtool: 'cheap-module-source-map', // cheap-source-map不适用terser-webpack-plugin压缩插件
  },
  test: { // 测试环境
    NODE_ENV: 'test',
    publicPath: '//static2.test.ximalaya.com/sr012018/card-voucher-2019/last/dist/',
    devtool: 'cheap-module-source-map',
  },
  production: {  // 生产环境
    NODE_ENV: 'production',
    publicPath: '//s1.xmcdn.com/sr012018/card-voucher-2019/last/dist/',
    devtool: false,
  },
}
