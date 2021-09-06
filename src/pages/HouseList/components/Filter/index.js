import React from 'react'

// 导入Filter组件包含的三个子组件
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'


import './index.scss'

export default class Filter extends Component {
  render() {
    return (
      <div>
        <FilterTitle />

        <FilterPicker />

        <FilterMore />
      </div >
    )
  }
}