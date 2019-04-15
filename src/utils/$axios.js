/* 
 * @Desc: 创建axios实例,添加请求/响应拦截器.
 * @Author: Eleven 
 * @Date: 2019-04-15 23:18:15 
 * @Last Modified by: Eleven
 * @Last Modified time: 2019-04-15 23:45:30
 */

import axios from 'axios'
import qs from 'qs'

// 创建axios实例
const instance = axios.create({
  // 超时设置(单位毫秒),1分钟.
  timeout: 60*1000,
  // 响应的数据格式: json / blob /document /arraybuffer / text / stream
  // responseType: 'json',
})

// 请求拦截
instance.interceptors.request.use( config => {
    // To-Do: 在发送请求之前做些什么
    return config
  }, error => {
    // To-Do: 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 响应拦截
instance.interceptors.response.use( response => {
    // To-Do: 对响应数据做点什么
    const { status, data } = response
    const { data: res } = response
    
    if( status === 401 ){
      
    }
    if( status >= 500 ){
      console.log(res.message)
    }

    return data
  }, error => {
    // To-Do: 响应失败做点什么
    return Promise.reject(error)
  },
)

export default instance