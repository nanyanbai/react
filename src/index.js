import React from 'react';
import ReactDOM from 'react-dom';



// 导入 antd-mobile 的样式
import 'antd-mobile/dist/antd-mobile.css'

// 导入字体图标库的样式文件库
import './assets/fonts/iconfont.css'

// 导入react-virtualized 长列表渲染组件样式
import 'react-virtualized/styles.css'

// 注意 我们自己写的全局样式需要放在组件库样式后面导入， 这样，样式才会生效！ 因为后面的样式会覆盖前面样式
import './index.css';

// 注意： 应该将组件的导入放在样式导入的后面，从而避免样式覆盖的问题
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

