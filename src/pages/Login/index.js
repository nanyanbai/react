import React from 'react'


import { NavBar, InputItem, Button } from 'antd-mobile'

import './login.scss'

export default class Login  extends React.Component {

  state = {
    
  }

  render() {
    return (
      <div className="login-wrapper">
        <NavBar mode="light"> 手机验证登录 </NavBar>

        <InputItem  placeholder="请输入手机号"  clear />

        <div className="code">
          <InputItem  placeholder="请输入验证码" />
          <Button>获取验证码</Button>
        </div>
      </div>
    )
  }
}