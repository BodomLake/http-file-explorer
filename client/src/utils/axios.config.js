import axios from "axios";
import {
  message
} from 'ant-design-vue';

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: "/api",
  // 超时
  timeout: process.env.NODE_ENV === 'development' ? 50000 : 100000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    return config;
  })

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.status || 200;
    // console.log('res: ', res, code)

    if (code !== 200 && code !== 304) {
      return Promise.reject("error");
    } else if (code == 200 || code == 304) {
      // message.success(res)
      return Promise.resolve(res);
    }

    if (code === 401) {
      message.warn('请重新登录')
      return Promise.reject("无效的会话，或者会话已过期，请重新登录。");
    } else if (code === 500) {
      message.warn('系统错误：', res)
      return Promise.reject(new Error(msg));
    }

    return Promise.resolve(res.data)
  },
  (err) => {
    let msg = err.message;
    if (msg == "Network Error") {
      msg = "后端接口连接异常";
    } else if (msg.includes("timeout")) {
      msg = "系统接口请求超时";
    } else if (msg.includes("Request failed with status code")) {
      msg = "系统接口" + msg.substr(msg.length - 3) + "异常";
    }
    message.error(msg)
    return Promise.reject(err);
  }
)

export default service;
