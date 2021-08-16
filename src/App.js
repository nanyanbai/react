import React from 'react'

// 导入常用的路由组件
import { BrowserRouter  as Router, Route, Link } from 'react-router-dom'

// 导入（页面）组件
import Home from './pages/Home'
import CityList from './pages/CityList' 


// 导入要使用的组件
import { Button } from 'antd-mobile'


function App() {
  return ( 
    <Router>
      <div className="App">
        {/* 项目的根组件 <Button>登录</Button> */}
        
        {/* 配置路由 */}
        <Route path="/home"  component= { Home }/> 
        <Route path="/cityList"  component= { CityList }/> 
      </div>
    </Router>
  );
}

export default App;
