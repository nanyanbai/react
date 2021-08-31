import React from 'react'


import { NavBar, InputItem, Button, Toast } from 'antd-mobile'

import { phoneReg,  verifyCode } from '../../utils/validate'

import './login.scss'

export default class Login  extends React.Component {

  state = {
    username: '',
    password: '',
    phone: '',
    verifyCode: ''
  }

  saveDate = (type) => {
    return (value) => {
      if(type === 'username' && value) return  this.setState({[type]: value})
      if(type === 'password' && value) return  this.setState({[type]: value})
      if(type === 'phone' && phoneReg.test(value)) return  this.setState({[type]: value})
      if(type === 'verifyCode' && verifyCode.test(value)) return  this.setState({[type]: value})
      this.setState({[type]: ''})
    }
  }

  // 获取验证码的回调
  getVerifyCode =() => {
    const  { phone } = this.state
    if(!phone)  return  Toast.fail('手机号格式不合法', 1);
    
  }
  render() {
    return (
      <div className="login-wrapper">

        <NavBar mode="light"> 手机验证登录 </NavBar>

        <InputItem  placeholder="请输入用户名"  onChange={this.saveDate('username')}  clear />

        <InputItem  type="password" placeholder="请输入密码"  onChange={this.saveDate('password')}  clear />

        <InputItem  placeholder="请输入手机号" onChange={this.saveDate('phone')}  clear />

        <div className="verify-input">
          <InputItem  placeholder="请输入验证码" onChange={this.saveDate('verifyCode')} clear />
          <button 
            className="verify-btn"
            onTouchEnd={this.getVerifyCode()}
          >获取验证码</button>
        </div>

        <Button type="primary"  className="login-btn">登录</Button>
      </div>
    )
  }
}