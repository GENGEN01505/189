import HttpRequest from '@/libs/axios'
import config from '@/config'

var baseUrl =process.env.NODE_ENV === 'development' ? config.baseUrl.dev : process.env.VUE_APP_PATH === 'test' ? config.baseUrl.test : config.baseUrl.pro;
// var baseUrl='http://192.168.9.20'
// console.log(process.env.NODE_ENV)
// console.log(baseUrl)
const axios = new HttpRequest(baseUrl)
export default axios
