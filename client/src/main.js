import {createApp} from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router'
import {createPinia} from 'pinia'
// 加载antd-vue组件库和样式
import 'ant-design-vue/dist/antd.css'; // or 'ant-design-vue/dist/antd.less'
import {
  Input,
  Button,
  Select,
  Col,
  Row,
  Avatar,
  Tree,
  Spin,
  List,
  Collapse,
  Tabs,
  Modal,
  Card,
  Menu,
  MenuItem,
  Dropdown,
  Tooltip,
  Breadcrumb
} from 'ant-design-vue';

// app的实例化
const app = createApp(App)
app.use(Input);
app.use(Select);
app.use(Button);
app.use(Col);
app.use(Row);
app.use(Avatar);
app.use(Tree);
app.use(Collapse);
app.use(List);
app.use(Spin);
app.use(Tabs);
app.use(Modal);
app.use(Card);
app.use(Menu);
app.use(MenuItem);
app.use(Dropdown);
app.use(Tooltip);
app.use(Breadcrumb);
// 安装 Pinia
app.use(createPinia())

/*import router from './router/index.js'
app.use(router)*/

// 挂载到 #app的DOM上面
app.mount('#app')
