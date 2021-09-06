import React from 'react'

import { Flex } from 'antd-mobile'

// 这是 withRouter 路由组件中的一个高阶组件
import { withRouter } from 'react-router-dom'

// 导入组件属性效验
import PropTypes from 'prop-types'

import './index.scss'

// 这是导出一个函数组件 
/**
 * 注意： SearchHeader 这个组件并不是直接通过路由来渲染出来的，它是找房列表中的一个子组件，
 * 所以在这个组件中无法直接获取到路由信息的
 * 解决：通过路由组件中的一个高阶组件来处理这个问题 使用withRouter 来包装下这个组件之后，我们这个组件就能
 * 接受到路由相关的信息了
 */
function SearchHeader({ history, cityName, className }) {
  return (
    // 我们对这个className 做个判断，如果没传这个样式 就给个空
    <Flex className={['search-box', className || ''].join(' ')}>
      {/* 左侧白色区域 */}
      <Flex className="search">
        {/* 位置 */}
        <div
          className="location"
          onClick={() => history.push("/citylist")}
        >
          <span className="name">{cityName}</span>
          <i className="iconfont icon-arrow" />
        </div>

        {/* 搜索表单 */}
        <div
          className="form"
          onClick={() => history.push("/search")}
        >
          <i className="iconfont icon-seach" />
          <span className="text">请输入小区或地址</span>
        </div>
      </Flex>
      {/* 右侧地图图标 */}
      <i
        className="iconfont icon-map"
        onClick={() => history.push("/map")}
      />
    </Flex>
  )
}

// 添加属性效验
SearchHeader.propTypes = {
  cityName: PropTypes.string.isRequired
}


export default withRouter(SearchHeader)