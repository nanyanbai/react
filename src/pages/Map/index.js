import React from "react";

import { Link } from "react-router-dom";

import { Toast } from 'antd-mobile'

// 导入封装好的NavHeader 组件
import NavHeader from "../../components/NavHeader";

import { reqGetMap, reqGetHouses } from "../../api";

// 导入样式
import "./index.scss";

// 解决脚手架中全局变量访问的问题
const BMapGL = window.BMapGL;

// 覆盖物样式
const labelStyle = {
  cursor: "pointer",
  border: "0px solid  rgb(255,0,0)",
  padding: "0px",
  whiteSpace: "nowrap",
  fontSize: "12px",
  color: "rgb(255,255,255)",
  textAlign: "center",
};
export default class Map extends React.Component {
  state = {
    houseList: [],
    // 标识是否展示房源列表
    isShowList: false,
  };

  componentDidMount() {
    this.initMap();
  }
  // 初始化地图
  initMap() {
    // 获取当前定位城市
    const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"));

    // 初始化地图实例
    // 注意：在 react 脚手架中全局对象需要使用 window 来访问，否则，会造成 ESLint 校验错误
    const map = new BMapGL.Map("container");

    this.map = map; // 这一步的作用： 能够在其他方法中 通过 this 来获取到地图对象

    // 设置中心点坐标(这是写死的，为了方便测试)
    // const point = new BMapGL.Point(116.404, 39.915)

    const myGeo = new BMapGL.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      async (point) => {
        if (point) {
          // 初始化地图
          map.centerAndZoom(point, 11);
          // map.addOverlay(new BMapGL.Marker(point))
          // 添加常用控件
          map.addControl(new BMapGL.ZoomControl());
          map.addControl(new BMapGL.ScaleControl());

          // 调用renderOverlays() 方法
          this.renderOverlays(value);
          // const res = await reqGetMap(value);
          // res.body.forEach((item) => {
          //   // label: areaName   这相当于给label 取了一个别名
          //   const {
          //     coord: { longitude, latitude },
          //     label: areaName,
          //     count,
          //     value
          //   } = item;
          //   // 创建覆盖物
          //   const areaPoint = new BMapGL.Point(longitude, latitude)
          //   const label = new BMapGL.Label("", {
          //     position: areaPoint,
          //     offset: new BMapGL.Size(-35, -35),
          //   });

          //   // 给label 对象添加一个唯一标识
          //   label.id = value

          //   // 设置房源覆盖内容
          //   label.setContent(`
          //     <div class="bubble">
          //       <p class="name">${areaName} </p>
          //       <p>${count}套</p>
          //     </div>
          //   `);

          //   //设置样式
          //   label.setStyle(labelStyle);

          //   // 添加单机事件
          //   label.addEventListener("click", () => {
          //     /**
          //      * 放大地图，以当前点击的覆盖为中心放大地图
          //      *  第一个参数： 坐标对象
          //      *  第二个参数：放大级别
          //     */
          //     map.centerAndZoom(areaPoint, 13)

          //     // 清除当前覆盖物信息
          //     setTimeout(() => {
          //       map.clearOverlays()
          //     }, 0)
          //   });

          //   // 添加覆盖物到地图中
          //   map.addOverlay(label);
          // })
        }
      },
      label
    )

    // 给地图绑定移动事件
    map.addEventListener('movestart', (e) => {
      if (this.state.isShowList) {
        this.setState({
          isShowList: false
        })
      }
    })
  }
  /**
   * 渲染覆盖物入口
   * 1、接收区域id参数， 获取该区域下的房源数据
   * 2、获取房源类型以及下级地图缩放级别
   */
  async renderOverlays(id) {
    // 开启 loading 效果  说明：  可能这个请求会失败，想要代码健壮性，采用try ... catch
    try {
      Toast.loading('加载中...', 0, null, false)
      const res = await reqGetMap(id);
      const data = res.body;
      // 关闭 loading
      Toast.hide()
      const { nextZoom, type } = this.getTypeAndZoom();
      data.forEach((item) => {
        // 创建覆盖物
        this.createOverlays(item, nextZoom, type);
      })
    } catch (error) {
      Toast.hide()
    }

  }
  //计算要绘制的覆盖物类型和下一个缩放级别
  getTypeAndZoom() {
    // 调用地图的 getZoom() 方法，来获取当前缩放级别
    const zoom = this.map.getZoom();
    let nextZoom, type;

    if (zoom >= 10 && zoom < 12) {
      //区
      nextZoom = 13;
      type = "circle"; // 圆形
    } else if (zoom >= 12 && zoom < 14) {
      //镇
      nextZoom = 15;
      type = "circle"; // 圆形
    } else if (zoom >= 14 && zoom < 16) {
      // 小区
      type = "rect";
    }

    return {
      nextZoom,
      type,
    };
  }

  // 创建覆盖物
  createOverlays(data, zoom, type) {
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value,
    } = data;
    const areaPoint = new BMapGL.Point(longitude, latitude);
    if (type === "circle") {
      // 区和镇
      this.createCircle(areaPoint, areaName, count, value, zoom);
    } else {
      this.createRect(areaPoint, areaName, count, value);
    }
  }

  // 创建区、镇覆盖物
  createCircle(point, name, count, id, zoom) {
    // 创建覆盖物
    const label = new BMapGL.Label("", {
      position: point,
      offset: new BMapGL.Size(-35, -35),
    });

    // 给label 对象添加一个唯一标识
    label.id = id;

    // 设置房源覆盖内容
    label.setContent(`
        <div class="bubble">
          <p class="name">${name} </p>
          <p>${count}套</p>
        </div>
      `);

    //设置样式
    label.setStyle(labelStyle);

    // 添加单机事件
    label.addEventListener("click", () => {
      this.renderOverlays(id);
      /**
       * 放大地图，以当前点击的覆盖为中心放大地图
       *  第一个参数： 坐标对象
       *  第二个参数：放大级别
       */
      this.map.centerAndZoom(point, zoom);

      // 清除当前覆盖物信息
      setTimeout(() => {
        this.map.clearOverlays();
      }, 0);
    });

    // 添加覆盖物到地图中
    this.map.addOverlay(label);
  }

  //创建小区覆盖物
  createRect(point, name, count, id) {
    // 创建覆盖物
    const label = new BMapGL.Label("", {
      position: point,
      offset: new BMapGL.Size(-50, -28),
    });

    // 给label 对象添加一个唯一标识
    label.id = id;

    // 设置房源覆盖内容
    label.setContent(`
      <div class="rect">
        <span class="housename">${name} </span>
        <span class="housenum">${count}套</span>
        <i class="arrow"></i>
      </div>
    `);

    //设置样式
    label.setStyle(labelStyle);

    // 添加单机事件
    label.addEventListener("click", (e) => {
      // TODO  目前存在问题 拿不到事件对象 e.changedTouches
      // 获取当前点击项  
      // const { clientX, clientY } = e.changedTouches[0]
      // this.map.panBy(window.innerWidth / 2 - clientX, (window.innerHeight - 330) / 2 - clientY)
      this.getHousesList(id);
    });

    // 添加覆盖物到地图中
    this.map.addOverlay(label);
  }

  // 获取小区房源数据
  async getHousesList(id) {
    try {
      Toast.loading('加载中...', 0, null, false)
      const res = await reqGetHouses(id);
      Toast.hide()
      this.setState({
        houseList: res.body.list,

        // 展示房源列表
        isShowList: true,
      })
    } catch (error) {
      Toast.hide()
    }
  }

  // 渲染房屋结构方法
  renderHouseList() {
    return this.state.houseList.map((item) => (
      <div className="house" key={item.houseCode}>
        <div className="imgWrap">
          <img src={`http://localhost:8080${item.houseImg}`} />
        </div>
        <div className="content">
          <h3 className="title">{item.title}</h3>
          <div className="desc">{item.desc}</div>
          <div className="tag-wrap">
            {item.tags.map((tag, index) => (
              <span
                key={index}
                className={[
                  "tag",
                  index === 0 ? "tag1" : index === 1 ? "tag2" : "tag3",
                ].join(" ")}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="price">
            <span className="priceNum">{item.price}</span>元/月
          </div>
        </div>
      </div>
    ));
  }

  render() {
    return (
      <div className="map">
        {/* 顶部导航栏组件 */}
        <NavHeader>地图找房</NavHeader>
        {/* 地图容器元素 */}
        <div id="container" />

        {/* 房源列表 */}

        <div
          className={["houseList", this.state.isShowList ? "show" : ""].join(
            " "
          )}
        >
          <div className="titleWrap">
            <h1 className="listTitle">房屋列表</h1>
            <Link className="titleMore" to="/home/list">
              更多房源
            </Link>
          </div>
          <div className="houseItems">{this.renderHouseList()}</div>
        </div>
      </div>
    );
  }
}
