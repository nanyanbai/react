import React from 'react'


// 导入路由
import { Route } from 'react-router-dom'

// 导入News组件
import News from '../News'
import Index from '../index'
import HouseList from '../HouseList'
import Profile from '../Profile'

// 导入TabBar
import { TabBar } from 'antd-mobile'

// 导入组件自己的样式文件
import './index.css'

// TabBar 数据
const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home/index'
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/list'
  },
  {
    title: '资讯',
    icon: 'icon-infom',
    path: '/home/news'
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  }
]


export default class Home extends  React.Component {
  // 这是状态相当于vue中的data 状态都是变化的数据
  state = {
    selectedTab:  this.props.location.pathname, // 默认选中的TabBar菜单项
    hidden: false, // 控制是否展示底部TabBar 的展示和隐藏
    // fullScreen: false,
  }

  // 渲染 TabBar.Item 的方法
  renderTabBarItem() {
    return tabItems.map((item, index) => 
      <TabBar.Item
        title={item.title}
        key={index}
        icon={
          <i className={`iconfont ${item.icon}`}></i>
        }
        selectedIcon={
          <i className={`iconfont ${item.icon}`}></i>
        }
        selected={this.state.selectedTab === item.path }
        onPress={() => {
          this.setState({
            selectedTab: item.path 
          })
          // 路由切换
          this.props.history.push(item.path)
        }}
      />  
    )
  }

  render() {
    return (
      <div  className="home">
        {/* 渲染子路由 */}
        <Route path="/home/news" component={ News }></Route>
        <Route path="/home/index" component={ Index }></Route>
        <Route path="/home/list" component={ HouseList }></Route>
        <Route path="/home/profile" component={ Profile }></Route>

        {/* TabBar */}
        
        <TabBar
          unselectedTintColor="#888"
          tintColor="#21b97a"
          barTintColor="white"
          hidden={this.state.hidden}
          noRenderContent= { true }
        >
          {/* 直接调用渲染TabBar.Item的方法 */}
          { this.renderTabBarItem() }
        </TabBar>
      </div>
    )
  }
}