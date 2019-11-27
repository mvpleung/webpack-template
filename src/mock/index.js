/* 
 * @Desc: MockJs，拦截ajax请求，返回mock数据。
 *   https://github.com/nuysoft/Mock/wiki/Getting-Started
 * @Author: Eleven 
 * @Date: 2019-04-15 23:10:38 
 * @Last Modified by: Eleven
 * @Last Modified time: 2019-11-27 11:15:48
 */

import Mock, { Random } from 'mockjs-async'

/**
 * mock模拟数据返回。
 */
Mock.mock('/test-mock', {
  code: 0,
  message: 'success',
  data: {
    name: Random.name(),
    uid: Random.guid(),
    email: Random.email(),
    city: Random.city(true),
    address: Random.region(),
  }
})