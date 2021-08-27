import React from 'react'


// 导入 antd-mobile  轮播组件
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'

import axios from 'axios'

import './index.scss'

// 导入导航菜单图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

// 导航菜单数据
const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/home/map'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/home/list'
  }
]

/**
 * 轮播图存在的问题：
 * 1. 不会自动播放
 * 2. 从其他路由返回的时候，高度不够
 * 
 * 原因： 轮播图是动态加载数据的， 加载完成前后轮播图数量不一致导致的
 * 解决： 
 * 1.在state中添加表示轮播图加载完成的数据
 * 2.在轮播图数据加载完成时， 修改该数据状态值为 true
 * 3.只有在轮播图数据加载完成的情况下，才渲染轮播图组件
 */


export  default class Index extends React.Component {
  // 状态
  state = {
    // 轮播图
    swipers: [],
    isSwiperLoaded: false,
    imgHeight: 212,
    // 租房小组
    groups: [],
    // 最新资讯
    news: []
  }
  // 获取轮播图数据的方法
  async getSwipers () {
    const res = await axios.get('http://localhost:8080/home/swiper')
    this.setState(() => {
      return {
        swipers : res.data.body,
        isSwiperLoaded: true
      }
    })
  }

  // 获取租房小组数据的方法
  async getGroups() {
    const res = await axios.get('http://localhost:8080/home/groups', { params: {area: 'AREA|88cff55c-aaa4-e2e0' }})
    this.setState(() => {
      return {
        groups:  res.data.body
      }
    })
  }

  // 获取最新资讯
  async getNews() {
    const res = await axios.get(
      'http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
    )

    this.setState({
      news: res.data.body
    })
  }

  // 这个钩子函数是页面一进来就就行加载
  componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()
  }

  // 渲染轮播图的结构
  renderSwipers() {
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="https://www.baidu.com"
        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
          onLoad={() => {
            window.dispatchEvent(new Event('resize'));
            this.setState({ imgHeight: 'auto' });
          }}
        />
      </a>
    ))
  }

  // 渲染导航菜单的结构
  renderNavs() {
    return navs.map( item => 
      <Flex.Item  key={ item.id }  onClick= {() => this.props.history.push(item.path)}>
        <img src={ item.img }/>
        <h2>{ item.title }</h2>
      </Flex.Item>
    )
  }

  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }
  
  render() {
    return (
      <div className="index">
        {/* 轮播图 */}
        <div className="swiper">
          { this.state.isSwiperLoaded ? (
              <Carousel
                autoplay={true}
                infinite={true}
              >
                {/* 调用渲染好的轮播图结构方法 */}
                { this.renderSwipers() }
              </Carousel>
            ): ''
          }
        </div>
          
        {/* 导航菜单 */}
        <Flex  className="nav">
          { this.renderNavs() }
        </Flex>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组 <span className="more">更多</span>
          </h3>
          {/* 宫格组件 */}
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={item => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    )
  }
}