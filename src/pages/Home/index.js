import React from 'react'


// 导入路由
import { Route } from 'react-router-dom'

// 导入News组件
import News from '../News'
import Index from '../Index'
import HouseList from '../HouseList'
import Profile from '../Profile'

// 导入TabBar
import { TabBar } from 'antd-mobile'

// 导入组件自己的样式文件
import './index.scss'

// TabBar 数据
const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    // path: '/home/index'
    path: '/home' // 解决路由高亮
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

/**
 * 问题：点击首页导航菜单，导航到 找房列表页面时， 找房菜单没有高亮
 * 原因：原来我们实现该功能的时候，只考虑了点击以及第一次加载 Home 组件的时候。 
 *       但是，我们没有考虑不重新加载Home组件时的路由切换，因为，这种情况下，我们的代码没有覆盖到
 * 
 * 解决：
 *  在路由切换时，也执行，菜单高亮的逻辑代码
 * 1.添加 componentDidUpdate 钩子函数
 * 2.在钩子函数中判断路由地址是否切换
 * 3.在路由地址切换时 ， 让菜单高亮
 */

export default class Home extends React.Component {
  // 这是状态相当于vue中的data 状态都是变化的数据
  state = {
    selectedTab: this.props.location.pathname, // 默认选中的TabBar菜单项
    hidden: false, // 控制是否展示底部TabBar 的展示和隐藏
    // fullScreen: false,
  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate')
    if (prevProps.location.pathname !== this.props.location.pathname) {
      // 此时，就说明路由发生切换了
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }

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
        selected={this.state.selectedTab === item.path}
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
      <div className="home">
        {/* 渲染子路由 */}
        <Route path="/home/news" component={News}></Route>
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/list" component={HouseList}></Route>
        <Route path="/home/profile" component={Profile}></Route>

        {/* TabBar */}

        <TabBar
          unselectedTintColor="#888"
          tintColor="#21b97a"
          barTintColor="white"
          hidden={this.state.hidden}
          noRenderContent={true}
        >
          {/* 直接调用渲染TabBar.Item的方法 */}
          {this.renderTabBarItem()}
        </TabBar>
      </div>
    )
  }
}