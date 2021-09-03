import React from 'react'

import { NavBar } from 'antd-mobile'

// 导入 withRouter 高阶组件
import { withRouter } from 'react-router-dom'

// 导入pros 效验的包
import PropTypes from 'prop-types'

import './index.scss'

/**
 * 注意： 默认情况下，只要路由Route 直接渲染的组件才能够获取到路由信息（比如： history.go() 等）
 * 如果需要在其他组件中获取到路由信息可以通过withRouter高阶组件来获取
 * 1、从react-router-dom 中导入 widthRouter 高阶组件
 * 2、使用widthRouter 高阶组件包装 NavHeader 组件。 目的： 包装后，就可以在组件中获取到当前路由的信息了
 * 3、从props中结构出 history 对象
 * 4、调用history.go() 实现返回上一页功能
 * 5、从props 中结构出 onLeftClick  函数，实现自定义 < 按钮的点击事件
 */

function NavHeader({ children, history, onLeftClick }) {
  // onLeftClick 如果在组件中自己组定义了一个事件的，我们把这个事件解够出来, 否则就是默认返回上一页
  // 默认点击行为
  const defaultHandler = () => history.go(-1)
  return (
    <NavBar
      className="navbar"
      mode="light"
      icon={<i className="iconfont icon-back" />}
      onLeftClick={onLeftClick || defaultHandler}
    >
      {children}
    </NavBar>
  )
}

// 添加props效验
NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func
}

// withRouter(NavHeader) 函数的返回值也是一个组件
export default withRouter(NavHeader)