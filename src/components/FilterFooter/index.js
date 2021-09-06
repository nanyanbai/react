import React from 'react'

import { Flex } from 'antd-mobile'
import PropTypes from 'prop-types'

import './index.scss'

function FilterFooter({
  cancelText = '取消',
  okText = '确定',
  onCancel,
  onOk,
  className
}) {
  return (
    <Flex className={['root', className || ''].join(' ')}>
      {/* 取消按钮 */}
      <span
        className={['btn', 'cancel'].join(' ')}
        onClick={onCancel}
      >
        {cancelText}
      </span>

      {/* 确定按钮 */}
      <span className={['btn', 'ok'].join(' ')} onClick={onOk}>
        {okText}
      </span>
    </Flex>
  )
}

// props校验
FilterFooter.propTypes = {
  cancelText: PropTypes.string,
  okText: PropTypes.string,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  className: PropTypes.string
}

export default FilterFooter
