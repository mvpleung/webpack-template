/* 
 * @Desc: page-b入口
 * @Author: Eleven 
 * @Date: 2019-01-05 00:55:26 
 * @Last Modified by: Eleven
 * @Last Modified time: 2019-06-21 15:59:42
 */

import '@babel/polyfill'
import { isMock } from 'utils'
import $axios from 'utils/$axios'
import 'assets/style/modules/page-a'
import index from 'src/pages/page-a'

// 是否启用mock
isMock && require('src/mock')

class ViewIndex {
  init() {
    index.init()
    // this.testMock()
  }
  
  testMock() {
    $axios(`/test-mock`).then(res => {
      console.log(res, 'this is the mock data')
    })
  }
}

new ViewIndex().init()
