import axios from 'axios'
import store from '@/store'
import QS from 'qs'
// import { Spin } from 'iview'
import {getToken} from '@/libs/util'
import vue from '@/main'
import router from '@/router/index'
import {resetRouter} from '@/router/index'

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig (conTentType) {
    const token = getToken();
    var headers={
      'Content-Type': conTentType
    }
    if(token){
      headers={
        'Content-Type':conTentType,
        'Authorization':token
      }
    }
    var config = {
      baseURL: this.baseUrl,
      headers
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      vue.$Message.error({
        content:"系统错误，请刷新页面重试，或者联系管理员",
        duration:2
      });
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
      console.log(error.response)
     if(error.response.status==401){
      vue.$Message.error({
        content:"用户登录信息已失效，请重新登录",
        duration:2
      });
      setTimeout(()=>{
        store.dispatch('webLogOut').then(() => {
          resetRouter()
          router.push({
            name: 'login'
          })
        })
      },2000)
     }else if(error.response.status==403){
      vue.$Message.error({
        content:"您无权访问此接口，请联系管理员操作",
        duration:2
      });
     }else if(error.response.status==500){
        vue.$Message.error({
          content:"系统错误，请刷新页面重试，或者联系管理员",
          duration:2
        });
     }else if(error.response.status==400){
      vue.$Message.error({
        content:"系统错误",//+error.response.message,
        duration:2
       });
     }else{
      vue.$Message.error({
        content:"服务器开了小差！请刷新页面重试",
        duration: 2
      });
        this.destroy(url)
        let errorInfo = error.response
        if (!errorInfo) {
          const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
          errorInfo = {
            statusText,
            status,
            request: { responseURL: config.url }
          }
        }
    }
      // addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options,conTentType="application/json") {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(conTentType), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
