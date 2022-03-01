import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = store.getters.token || '' // getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (res.status !== 200) {
      let message = res.message || 'Error'
      if (res.status === 3001) { // 用户未登录
        store.dispatch('user/setInfo', {})
        // window.location.reload()
        return
      } else if (res.status === 1001) { // 非法参数
        if (res.data instanceof Object) {
          for (const key in res.data) {
            message = res.data[key]
            break
          }
        } else {
          message = res.data || res.message
        }
      }
      Message({
        message: message,
        type: 'error',
        duration: 3.6 * 1000
      })
      return Promise.reject(new Error(message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3.6 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
