import React from "react";

import { Toast } from "antd-mobile";

import { List, AutoSizer } from "react-virtualized";

// 导入封装好的NavHeader 组件
import NavHeader from '../../components/NavHeader'

import { reqGetCityList, reqGetHotCity } from "../../api";

// 导入 utils 中获取当前定位城市的方法
import { getCurrentCity } from "../../utils";

import "./index.scss";

// 索引（A、B等）的高度
const TITLE_HEIGHT = 36;
// 每个城市名称的高度
const NAME_HEIGHT = 50;

// 有房源的城市
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']
// 数据格式化的方法
const formatCityData = (list) => {
  const cityList = {};
  // const cityIndex = []  因为这里用const 声明过，不能直接修改了
  // 遍历list数据
  list.forEach((item) => {
    // 获取每一个城市的首字母
    const first = item.short.substr(0, 1);
    // 判断 cityList 中是否有该分类
    if (cityList[first]) {
      // 如果有，直接往该分类中push数据
      cityList[first].push(item);
    } else {
      // 如果没有，就先创建一个数组，然后，把当前城市信息添加到数组中
      cityList[first] = [item];
    }
  });

  // 获取索引数据
  // Object.keys(cityList) 把 cityList 对象转成数组
  const cityIndex = Object.keys(cityList).sort();

  return {
    cityList,
    cityIndex,
  };
};

// 封装处理字母索引的方法
const formatCityIndex = (letter) => {
  switch (letter) {
    case "#":
      return "当前定位";
    case "hot":
      return "热门城市";
    default:
      return letter.toUpperCase();
  }
};

// 列表数据的数据源
// const list = Array(160).fill('我是长列表啊')

export default class CityList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0, // 指定右侧字母索引列表高亮的索引号
    };

    // 创建ref对象
    this.cityListComponent = React.createRef();
  }

  async componentDidMount() {
    await this.getCityList();

    // 调用 measureAllRows  提前计算 List 组件 中每一行的高度，实现scrollToRow 的精确跳转
    // 注意：调用这个方法的时候，需要保证 List 组件中已经有数据了， 如果List 组件中的数据为空，就会导致调用方法报错
    // 解决： 只要保证这个方法是在 获取到数据之后，调用即可 ,  采用 async  和 await
    this.cityListComponent.current.measureAllRows();
  }

  // 获取城市列表数据的方法
  async getCityList() {
    const params = {
      level: 1,
    };
    const res = await reqGetCityList(params);
    const { cityList, cityIndex } = formatCityData(res.body);
    const hotCityRes = await reqGetHotCity();

    cityList["hot"] = hotCityRes.body;
    cityIndex.unshift("hot");

    // 获取当前定位城市
    const currCity = await getCurrentCity();
    cityList["#"] = [currCity];
    cityIndex.unshift("#");

    // 设置状态值
    this.setState({
      cityList,
      cityIndex,
    })
  }
  // 点击切换城市的方法
  changeCity = (item) => {
    const { label, value } = item
    if (HOUSE_CITY.includes(label)) {
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      this.props.history.go(-1)
    } else {
      Toast.info('该城市暂无房源数据', 1)
    }
  }
  // List组件渲染每一行的方法
  rowRenderer = ({
    key,
    index, // 索引号
    isScrolling,
    isVisible, // 当前项在 List 中是可见的
    style,
  }) => {
    // 获取每一行字母的索引
    // console.log(this)  this指向的问题 ,  this ==>undefined  所以要把rowRenderer这个函数改为箭头函数就行
    const { cityIndex, cityList } = this.state;
    const letter = cityIndex[index];

    // 获取指定字母索引下的城市列表数据
    // console.log(cityList[letter])
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {cityList[letter].map((item) => (
          <div className="name" key={item.value} onClick={() => this.changeCity(item)}>
            {item.label}
          </div>
        ))}
      </div>
    );
  };
  // 创建动态计算每一行高度的方法
  getRowHeight = ({ index }) => {
    // 索引标题高度 + 城市数量 * 城市名称的高度
    const { cityList, cityIndex } = this.state;
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT;
  };

  // 封装渲染右侧索引列表的方法
  renderCityIndex() {
    const { cityIndex, activeIndex } = this.state;
    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => {
          this.cityListComponent.current.scrollToRow(index);
        }}
      >
        <span className={activeIndex === index ? "index-active" : ""}>
          {item === "hot" ? "热" : item.toUpperCase()}
        </span>
      </li>
    ));
  }

  // 用于获取List组件中渲染行的信息
  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex,
      });
    }
  };

  render() {
    return (
      <div className="city-list">
        {/* <NavBar
          className="navbar"
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市选择
        </NavBar> */}
        <NavHeader>
          城市选择
        </NavHeader>
        {/* 城市列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.cityListComponent}
              width={width}
              height={height}
              //列表数
              rowCount={this.state.cityIndex.length}
              //行高,可以直接写高度,也可以是个函数,当行高不确定时,就需要在函数里面计算返回了
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>

        {/* 右侧索引列表 */}
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    );
  }
}
