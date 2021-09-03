import React from "react"

import { Link } from "react-router-dom"

import { Grid, Button, Modal } from "antd-mobile"

import './index.scss'

// 九宫格菜单数据
const menus = [
  { id: 1, name: "我的收藏", iconfont: "icon-coll", to: "/favorate" },
  { id: 2, name: "我的出租", iconfont: "icon-ind", to: "/rent" },
  { id: 3, name: "看房记录", iconfont: "icon-record" },
  { id: 4, name: "成为房主", iconfont: "icon-identity" },
  { id: 5, name: "个人资料", iconfont: "icon-myinfo" },
  { id: 6, name: "联系我们", iconfont: "icon-cust" },
];
export default class Profile extends React.Component {
  render() {
    return (
      <div className="wrapper">
        {/* 个人信息 */}
        <div className="user-top">
          {/* <img className="bg" src={ } /> */}
        </div>
        {/* 九宫格菜单 */}
        <Grid
          className="menu"
          data={menus}
          columnNum={3}
          hasLine={true}
          renderItem={(item) =>
            item.to ? (
              <Link to={item.to}>
                <div className="menuItem">
                  <i className={`iconfont ${item.iconfont}`}></i>
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
              <div className="menuItem">
                <i className={`iconfont ${item.iconfont}`}></i>
                <span>{item.name}</span>
              </div>
            )
          }
        ></Grid>
      </div>
    );
  }
}
