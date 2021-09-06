import React from 'react'

import { Flex } from 'antd-mobile'

import './index.scss'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]


export default function FilterTitle({ titleSelectStatus, onClick }) {
  return (
    <Flex align="center" className="root">
      {
        titleList.map(item => {
          const isSelected = titleSelectStatus[item.type]
          return (<Flex.Item key={item.type} onClick={() => onClick(item.type)}>
            <span className={['dropdown', isSelected ? 'selected' : ''].join(' ')}>
              <span>{item.title}</span>
              <i className="iconfont icon-arrow"></i>
            </span>
          </Flex.Item>)
        })
      }
    </Flex>
  )
}