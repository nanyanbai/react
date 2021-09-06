import React, { Component } from "react";

import { reqGetHousesCondition } from "../../../../api";

// 导入Filter组件包含的三个子组件
import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

import "./index.scss";

const titleSelectStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
};

const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends Component {
  state = {
    titleSelectStatus,
    // 控制 FilterPicker 或 FilterMore 组件的展示或隐藏
    openType: "",
    filtersData: {}, // 所有筛选条件数据
    // 筛选条件的选中值
    selectedValues
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
    this.setState((prevState) => {
      return {
        titleSelectStatus: {
          ...prevState.titleSelectStatus,
          [type]: true,
        },
        // 展示对话框
        openType: type,
      };
    });
  };
  // 取消（隐藏对话框）
  onCancel = () => {
    this.setState({
      openType: "",
    });
  };

  // 确定（隐藏对话框）
  onSave = (type, value) => {
    this.setState({
      openType: "",

      selectedValues: {
        ...this.state.selectedValues,
        [type]: value
      }
    });
  };

  // 渲染 FilterPicker 组件的方法
  renderFilterPicker = () => {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state;
    if (openType !== "area" && openType !== "mode" && openType !== "price") {
      return null;
    }
    // 根据 openType 来拿到当前筛选条件数据
    let data = [];
    let cols = 3;
    let defaultValue = selectedValues[openType]
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

  render() {
    const { titleSelectStatus, openType } = this.state; // 从state中把状态解构出来
    return (
      <div className="wrapper">
        {/* 前三个菜单的遮罩层 */}

        {openType === "area" || openType === "mode" || openType === "price" ? (
          <div className="mask" onClick={this.onCancel} />
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
          {/* <FilterMore /> */}
        </div>
      </div>
    );
  }
}
