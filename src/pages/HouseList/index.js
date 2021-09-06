import React from "react"

import { Flex } from "antd-mobile"

// 导入搜索导航栏组件
import SearchHeader from "../../components/SearchHeader"
import Filter from './components/Filter'

import "./index.scss"
// 注意： 写在行类的样式后面会覆盖前面的样式

// 获取当前定位城市的信息
const { label } = JSON.parse(localStorage.getItem("hkzf_city"))
export default class HouseList extends React.Component {
  render() {
    return (
      <div className="houseList">
        {/* 注意： SearchHeader这个组件需要传递的名称是cityName 值为： label */}
        <Flex className="header">
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          ></i>
          <SearchHeader cityName={label} className="searchHeader" />
        </Flex>

        {/* 条件筛选栏 */}
        <Filter />
      </div>
    )
  }
}
