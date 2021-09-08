import React from "react"

import { Flex, Toast } from "antd-mobile"

import { List, AutoSizer, WindowScroller, InfiniteLoader } from "react-virtualized"

import { reqGetHouseList } from '../../api'

// 导入搜索导航栏组件
import SearchHeader from "../../components/SearchHeader"
import Filter from './components/Filter'
import HouseItem from '../../components/HouseItem'
import NoHouse from '../../components/NoHouse'

import "./index.scss"
// 注意： 写在行类的样式后面会覆盖前面的样式

// 获取当前定位城市的信息
// const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"))
export default class HouseList extends React.Component {
  state = {
    list: [],
    count: 0, // 总条数
    isLoading: false
  }
  label = ''
  value = ''

  // 初始化实例属性
  filters = {}
  componentDidMount() {
    const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
    this.label = label
    this.value = value


    this.searchHouseList()
  }

  // 获取房屋列表数据
  async searchHouseList() {
    Toast.loading('加载中...', 0, null, false)
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    let params = {
      cityId: value,
      ...this.filters,
      start: 1,
      end: 20
    }
    const res = await reqGetHouseList(params)
    const { list, count } = res.body
    Toast.hide()
    if (count !== 0) {
      Toast.info(`共找到 ${count} 套房源`, 2, null, false)
    }

    this.setState({
      list,
      count
    })
  }

  // 接收 Filter 组件中的 筛选条件数据
  onFilter = (filters) => {
    //添加筛选功能重新置顶的效果、
    window.scrollTo(0, 0)

    this.filters = filters
    this.searchHouseList()
  }

  // List组件渲染每一行的方法
  renderHouseList = ({
    key,
    index, // 索引号
    style
  }) => {
    // 根据索引号来获取当前这一行的房屋数据
    const { list } = this.state
    const house = list[index]
    if (!house) {
      return (
        <div style={style} key={key}>
          <p className="loading"></p>
        </div>
      )
    }

    return (
      <HouseItem
        key={key}
        style={style}
        src={`http://localhost:8080${house.houseImg}`}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      />
    )
  };

  // 判断列表中的每一行是否加载完成
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }

  // 用来获取更多房屋列表数据
  loadMoreRows = ({ startIndex, stopIndex }) => {
    // console.log(startIndex, stopIndex)
    return new Promise(resolve => {
      // 数据加载完成时，调用 resolve 即可
      const params = {
        cityId: this.value,
        ...this.filters,
        start: startIndex,
        end: stopIndex
      }
      reqGetHouseList(params).then(res => {
        this.setState({
          list: [...this.state.list, ...res.body.list]
        })
      })
      resolve()
    })
  }


  renderList() {
    const { count, isLoading } = this.state
    if (count === 0 && isLoading) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>
    }
    return (
      <div className="houseItems">
        <InfiniteLoader isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={count}>
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller>
              {({ height, isScrolling, scrollTop }) => (
                <AutoSizer>
                  {({ width }) => (
                    <List
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                      autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                      width={width} // 视口的宽度
                      height={height} // 视口的高度
                      rowCount={this.state.count} // List列表项的行数
                      rowHeight={120} // 每一行的高度
                      rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                      isScrolling={isScrolling}
                      scrollTop={scrollTop}
                    />
                  )}
                </AutoSizer>
              )}
            </WindowScroller>
          )}
        </InfiniteLoader>
      </div>
    )
  }

  render() {
    return (
      <div className="houseList">
        {/* 注意： SearchHeader这个组件需要传递的名称是cityName 值为： label */}
        <Flex className="header">
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          ></i>
          <SearchHeader cityName={this.label} className="searchHeader" />
        </Flex>

        {/* 条件筛选栏 */}
        <Filter />

        {/* 房屋列表 */}
        <div className="houseItems">{this.renderList()}</div>
      </div>
    )
  }
}
