import React from 'react'

import PropTypes from 'prop-types'


import './index.scss'

const NoHouse = ({ children }) => (
  <div className="no-data">
    <img
      className="img"
      src={'http://localhost:8080' + '/img/not-found.png'}
      alt="暂无数据"
    />
    <p className="msg">{children}</p>
  </div>
)

NoHouse.propTypes = {
  children: PropTypes.node.isRequired
}

export default NoHouse
