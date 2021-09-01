import ajax from '../utils/request'


// 请求用户登录
export const reqPostLogin = (data) => ajax.post('http://localhost:8080/user/login', data)

