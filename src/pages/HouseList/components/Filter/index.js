import React, { Component } from "react";

import { reqGetHousesCondition } from "../../../../api";

// 导入Filter组件包含的三个子组件
import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

import "./index.scss";

// 标题高亮状态  true 表示高亮  false表示不高亮
const titleSelectStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
};

// FilterPicker 和 FilerMore 组件的选中值
const selectedValues = {
  area: ["area", "null"],
  mode: ["null"],
  price: ["null"],
  more: [],
};

export default class Filter extends Component {
  state = {
    titleSelectStatus,
    // 控制 FilterPicker 或 FilterMore 组件的展示或隐藏
    openType: "",
    filtersData: {}, // 所有筛选条件数据
    // 筛选条件的选中值
    selectedValues,
  };

  componentDidMount() {
    this.getFiltersData();
  }

  // 封装获取所有筛选条件的方法
  async getFiltersData() {
    // 获取到当前定位城市的id
    const { value } = JSON.parse(localStorage.getItem("hkzf_city"));
    const res = await reqGetHousesCondition(value);
    this.setState({
      filtersData: res.body,
    });
  }

  // 点击标题菜单实现高亮
  onTitleClick = (type) => {
    const { titleSelectStatus, selectedValues } = this.state;
    // 创建新的标题选中状态
    const newTitleSelectedStatus = { ...titleSelectStatus };
    Object.keys(newTitleSelectedStatus).forEach((key) => {
      // key 表示数组中的每一项，此处，就是每个标题的 type 值
      if (key === type) {
        // 判断当前标题
        newTitleSelectedStatus[type] = true;
        return; // 表示后续代码不执行了
      }
      // 其他标题
      const selectedVal = selectedValues[key];
      if (
        key === "area" &&
        (selectedVal.length !== 2 || selectedVal[0] !== "area")
      ) {
        newTitleSelectedStatus[key] = true;
      } else if (key === "mode" && selectedVal[0] !== "null") {
        newTitleSelectedStatus[key] = true;
      } else if (key === "price" && selectedVal[0] !== "null") {
        newTitleSelectedStatus[key] = true;
      } else if (key === "more" && selectedVal.length !== 0) {
        newTitleSelectedStatus[key] = true;
      } else {
        newTitleSelectedStatus[key] = false;
      }
    });
    this.setState({
      openType: type,
      titleSelectStatus: newTitleSelectedStatus,
    })
  };
  // 取消（隐藏对话框）
  onCancel = (type) => {
    const { titleSelectStatus, selectedValues } = this.state;
    const newTitleSelectedStatus = { ...titleSelectStatus };
    const selectedVal = selectedValues[type]
    if (
      type === "area" &&
      (selectedVal.length !== 2 || selectedVal[0] !== "area")
    ) {
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectedVal.length !== 0) {
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }
    this.setState({
      openType: "",

      titleSelectStatus: newTitleSelectedStatus
    });
  };

  // 确定（隐藏对话框）
  onSave = (type, value) => {
    // 菜单高亮逻辑处理
    const { titleSelectStatus } = this.state;
    const newTitleSelectedStatus = { ...titleSelectStatus };
    const selectedVal = value;
    if (
      type === "area" &&
      (selectedVal.length !== 2 || selectedVal[0] !== "area")
    ) {
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectedVal.length !== 0) {
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }

    const newSelectedValues = {
      ...this.state.selectedValues,
      [type]: value
    }

    console.log('拿到选中最新的值', newSelectedValues)
    const { area, mode, price, more } = newSelectedValues
    // 筛选条件数据
    const filters = {}

    // 区域
    const areaKey = area[0]
    let areaValue = 'null'
    if (area.length === 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    }
    filters[areaKey] = areaValue

    // 方式和租金
    filters.mode = mode[0]
    filters.price = price[0]

    // 更多
    filters.more = more.join(',')

    // 调用父组件中的方法，来将筛选数据传递给 父组件
    this.props.onFilter(filters)

    this.setState({
      openType: "",
      // 更新菜单高亮状态数据
      titleSelectStatus: newTitleSelectedStatus,
      selectedValues: newSelectedValues
    });
  };

  // 渲染 FilterPicker 组件的方法
  renderFilterPicker = () => {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues,
    } = this.state;
    if (openType !== "area" && openType !== "mode" && openType !== "price") {
      return null;
    }
    // 根据 openType 来拿到当前筛选条件数据
    let data = [];
    let cols = 3;
    let defaultValue = selectedValues[openType];
    switch (openType) {
      case "area":
        data = [area, subway];
        cols = 3;
        break;
      case "mode":
        data = rentType;
        cols = 1;
        break;
      case "price":
        data = price;
        cols = 1;
        break;
      default:
        break;
    }
    return (
      <FilterPicker
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        type={openType}
        defaultValue={defaultValue}
      />
    );
  };

  // 封装渲染 FilerMore 组件方法
  renderFilterMore() {
    const {
      openType,
      selectedValues,
      filtersData: { roomType, oriented, floor, characteristic },
    } = this.state;
    if (openType !== "more") {
      return null;
    }
    const data = {
      roomType,
      oriented,
      floor,
      characteristic,
    };
    const defaultValue = selectedValues.more;
    return (
      <FilterMore
        data={data}
        type={openType}
        onSave={this.onSave}
        defaultValue={defaultValue}
        onCancel={this.onCancel}
      />
    );
  }

  render() {
    const { titleSelectStatus, openType } = this.state; // 从state中把状态解构出来
    return (
      <div className="wrapper">
        {/* 前三个菜单的遮罩层 */}

        {openType === "area" || openType === "mode" || openType === "price" ? (
          <div className="mask" onClick={() => this.onCancel(openType)} />
        ) : null}

        <div className="content">
          {/* 标题栏 */}
          <FilterTitle
            titleSelectStatus={titleSelectStatus}
            onClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容 */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容 */}
          {this.renderFilterMore()}
        </div>
      </div>
    );
  }
}
