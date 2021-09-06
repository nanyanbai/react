import React, { Component } from "react";

import { PickerView } from "antd-mobile";

import FilterFooter from "../../../../components/FilterFooter";

import "./index.scss";

// const province = [

// ]

export default class FilterPicker extends Component {
  state = {
    value: this.props.defaultValue,
  };
  render() {
    const { onCancel, onSave, data, cols, type } = this.props; // 这是从父组件接收数据
    return (
      <>
        {/* 选择器组件 */}
        <PickerView
          data={data}
          value={this.state.value}
          cols={cols}
          onChange={(val) => {
            this.setState({
              value: val,
            });
          }}
        />

        {/* 底部按钮 */}

        <FilterFooter onCancel={() => onCancel()} onOk={() => onSave(type, this.state.value)} />
      </>
    );
  }
}
