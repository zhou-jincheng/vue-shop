import Vue from 'vue'
import axios from 'axios'


export function request(params) {

  // 创建axios实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })

  //配置拦截器
  instance.interceptors.request.use(config => {
    let tokenStr = window.sessionStorage.getItem("token");
    config.headers.Authorization = tokenStr;
    // console.log(config);
    return config
  })

  return instance(params)
}