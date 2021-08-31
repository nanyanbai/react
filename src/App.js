import React from 'react'

// 导入常用的路由组件
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

// 导入（页面）组件
import Login from './pages/Login'
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'


function App() {
  return (
    <Router>
      <div className="App">
        {/* 项目的根组件*/}

        {/* 默认路由 匹配时， 跳转到 /home  实现路由的重定向到首页 */}
        <Route exact path="/" render={() => <Redirect to="/home" />}  ></Route>
        {/* 配置路由 */}
        <Route path="/login" component={Login} />
        <Route path="/home" component={Home} />
        <Route path="/cityList" component={CityList} />
        <Route path="/map" component={Map} />
      </div>
    </Router>
  );
}

export default App;
