import Mock from 'mockjs'
import { login, logout, getUserInfo } from './login'
import { getTableData, getDragList, uploadImage } from './data'
import { getMessageInit, getContentByMsgId, hasRead, removeReaded, restoreTrash, messageCount } from './user'

// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 1000
})

// 登录相关和获取用户信息
// Mock.mock(/\/login/, login)
// Mock.mock(/\/get_info/, getUserInfo)
// Mock.mock(/\/logout/, logout)
// Mock.mock(/\/get_table_data/, getTableData)
// Mock.mock(/\/get_drag_list/, getDragList)
// Mock.mock(/\/save_error_logger/, 'success')

export default Mock
