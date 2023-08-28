import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 当跨域请求时发送cookie
  timeout: 1000 * 180, // 请求超时
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么

    if (store.getters.token) {
      // 让每个请求都带有令牌
      // ['X-Token']是自定义报头键
      // 请根据实际情况修改
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // 做一些请求错误
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果您想获得http信息，如标头或状态
   * 请返回response => response
  */

  /**
    *通过自定义代码确定请求状态
    *这里只是一个例子
    *也可以通过HTTP状态码来判断状态
   */
  response => {
    const res = response.data

    // 如果自定义码不是0，则判断为错误。
    if (res.rsp !== '1') {
      Message({
        message: res.message || Error,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: 其他已登录的客户端; 50014: 令牌过期;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // 重新登陆
        MessageBox.confirm('您已注销，您可以取消以留在此页面上，或重新登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export const apiPost = (url, {
  data = {}
} = {}) => {
  return new Promise((resolve, reject) => {
    service({
      method: 'post',
      url: url,
      data: data,
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
export default service
