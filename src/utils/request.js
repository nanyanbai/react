//  这是对axios 进行二次封装
import axios from 'axios'

// 获取环境变量中配置的URL地址
const BASE_URL = process.env.REACT_APP_URL

axios.defaults.baseURL = BASE_URL

// 使用 axios 的请求拦截
axios.interceptors.request.use(config => {
  return config
}, err => {
  return Promise.reject(err)
})


axios.interceptors.response.use(response => {
  const code = response.data.code
  if (code === 400) {
    return Promise.reject('err')
  } else {
    return response.data
  }
}, err => {
  alert(err.message)
  return new Promise(() => { })
})


export default axios