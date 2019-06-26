import axios from '@/libs/api.request'
import QS from 'qs'


export const login = ({phone, passWord,loginType,platform,smsCode}) => {
  const data = {
    phone,
    passWord,
    loginType,
    platform,
    smsCode
  }
  return axios.request({
    url: '/user/login',
    data,
    method: 'post'
  })
}

export const loginYun = ({authKey, authSecret,phone,smsCode}) => {
  const data = {
    authKey,
    authSecret,
    phone,
    smsCode
  }
  return axios.request({
    url: '/189/yun',
    data,
    method: 'post'
  })
}

export const getJSEuser = formData => {
  return axios.request({
    url: 'user/getJSEuser189',
    params:formData,
    method: 'get'
  })
}

export const registerUser = formData => {
  return axios.request({
    url: 'user/register',
    data:formData,
    method: 'post'
  })
}
// 发送短信验证码
export const sendCode =({phone,type,platform}) =>{
  var data = {
    phone,
    type,
    platform
  }

  return axios.request({
    url: '/sms/sendsms',
    method: 'post',
    data:QS.stringify(data)
  },'application/x-www-form-urlencoded');
}

// 身份验证
export const authentication = formData =>{
  return axios.request({
    url: '/user/authentication',
    method: 'get',
    params:formData
  });
}

// 重置密码
export const reset_passeord = formData =>{
  return axios.request({
    url: '/user/reset_passeord',
    method: 'put',
    data:QS.stringify(formData)
  },'application/x-www-form-urlencoded');
}

// 修改密码
export const change_passeord = formData =>{
  return axios.request({
    url: '/user/auth/change_passeord',
    method: 'put',
    data:QS.stringify(formData)
  },'application/x-www-form-urlencoded');
}
// 获取用户信息
export const getUserInfo = () => {
  return axios.request({
    url: '/user/auth/getUserInfos',
    method: 'get'
  })
}
// 登出
export const logout = () => {
  return axios.request({
    url: '/user/auth/logout',
    method: 'post'
  })
}

// 获取菜单

export const getMenu = () => {
  return axios.request({
    url: '/menu',
    method: 'get'
  })
}

// 获取黑名单
export const getBlackList = formData => {
  return axios.request({
    url: '/black/getBlackList',
    method: 'get',
    params:formData
  })
}

// 新增黑名单
export const addBlack = formData => {
  return axios.request({
    url: '/black/addBlack',
    method: 'post',
    data:formData
  })
}

// 删除黑名单
export const deleteBlack = formData => {
  return axios.request({
    url: '/black/deleteBlack',
    method: 'delete',
    data:formData
  })
}


// 查询log
export const getLogList = formData => {
  return axios.request({
    url: '/log/getLogList',
    method: 'get',
    params:formData
  })
}

