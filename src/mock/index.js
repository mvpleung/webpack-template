/* 
 * @Desc: MockJs，拦截ajax请求，返回mock数据。
 *   https://github.com/nuysoft/Mock/wiki/Getting-Started
 * @Author: Eleven 
 * @Date: 2019-04-15 23:10:38 
 * @Last Modified by: Eleven
 * @Last Modified time: 2019-04-17 11:36:21
 */

import Mock, { Random } from 'mockjs-async'
import $axois from 'utils/$axios'

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

/**
 * 异步从接口取数据，mock返回：
 *  mockjs并不支持异步，所以使用mockjs-async.
 */
Mock.mock('/test-mock-async', () => {
  return new Promise(resolve => {
    const url = `http://open.ximalaya.com/activities/data/welfare/banners`
    
    $axois.get(url).then(res => {
      resolve(res)
    })
  })
})

/**
 * 换个写法，总之只要返回的是Promise对象即可。
 */
// Mock.mock('/test-mock-async', async () => {
//   const url = `http://open.ximalaya.com/activities/data/welfare/banners`
//   const res = await $axois.get(url)
  
//   return res
// })