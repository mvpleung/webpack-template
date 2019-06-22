/* 
 * @Desc: index入口
 * @Author: Eleven 
 * @Date: 2019-01-05 00:55:26 
 * @Last Modified by: Eleven
 * @Last Modified time: 2019-06-22 17:06:51
 */

import '@babel/polyfill'
import { isMock } from 'utils'
import 'assets/style/modules/page-b'
import index from 'src/pages/page-b'

// 是否启用mock
isMock && require('src/mock')

class ViewIndex {
  constructor() {
    this.init()
  }
  
  init() {
    index.init()

    const a = {
      x: 1,
      y: 2,
    }

    const b = {
      z: 3,
      k: 'eleven',
    }

    const demo = Object.assign({}, a, b)
    console.log(demo)
  }
}

export default new ViewIndex()
