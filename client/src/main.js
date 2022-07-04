import {createApp} from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
// 加载antd-vue组件库和样式
import 'ant-design-vue/dist/antd.css'; // or 'ant-design-vue/dist/antd.less'
import { Button, Col, Row, Avatar, Tree ,Spin, List, Collapse, Tabs, Modal, Card, Menu, Dropdown} from 'ant-design-vue';
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
// app的实例化
const app = createApp(App)
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
app.use(Dropdown);
// 安装 Pinia
app.use(createPinia())

import router from './router/index.js'
app.use(router)

// 挂载到 #app的DOM上面
app.mount('#app')
