import React from "react";

import { NavBar } from "antd-mobile";

import { reqGetCityList, reqGetHotCity } from '../../api'

import "./index.scss";


// 数据格式化的方法
const formatCityData = (list) => {

  const cityList = {}
  // const cityIndex = []  因为这里用const 声明过，不能直接修改了
  // 遍历list数据
  list.forEach(item => {
    // 获取每一个城市的首字母
    const first = item.short.substr(0, 1)
    // 判断 cityList 中是否有该分类
    if (cityList[first]) {
      // 如果有，直接往该分类中push数据
      cityList[first].push(item)
    } else {
      // 如果没有，就先创建一个数组，然后，把当前城市信息添加到数组中
      cityList[first] = [item]
    }
  })

  // 获取索引数据
  // Object.keys(cityList) 把 cityList 对象转成数组
  const cityIndex = Object.keys(cityList).sort()

  return {
    cityList,
    cityIndex
  }
}

export default class CityList extends React.Component {

  componentDidMount() {
    this.getCityList()
  }

  // 获取城市列表数据的方法
  async getCityList() {
    const params = {
      level: 1
    }
    const res = await reqGetCityList(params)
    const { cityList, cityIndex } = formatCityData(res.body)
    const hotCityRes = await reqGetHotCity()
    cityList['hot'] = hotCityRes.body
    cityIndex.unshift('hot')

    console.log(cityList, cityIndex)
  }

  render() {
    return (
      <div className="city-list">
        <NavBar
          className="navbar"
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市选择
        </NavBar>
      </div>
    );
  }
}
