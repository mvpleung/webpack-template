/* 
 * @Desc: page-b入口
 * @Author: Eleven 
 * @Date: 2019-01-05 00:55:26 
 * @Last Modified by: Eleven
 * @Last Modified time: 2019-03-20 18:34:22
 */

import 'assets/style/modules/page-a'
import index from 'src/pages/page-a'

class ViewIndex {
  init() {
    index.init()
  }
}

new ViewIndex().init()
