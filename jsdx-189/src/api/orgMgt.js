import axios from '@/libs/api.request'
import QS from 'qs'

// 成员信息查询
export const getAppUserList = data => {
  return axios.request({
    url: '/member/getAppUserList',
    method: 'get',
    params:data
  })
}
// 添加新成员
export const addAppUserInfo = formData => {

  return axios.request({
    url: '/member/addAppUserInfo',
    method: 'post',
    data:formData
  })
}

// 添加新成员
export const updateName = formData => {

  return axios.request({
    url: '/member/updateName',
    method: 'put',
    data:formData
  })
}

// 删除新成员
export const deleteAppUser = ids => {

  return axios.request({
    url: '/member/deleteAppUser',
    method: 'delete',
    data:ids
  })
}

// 绑定业务号码
export const bindRecordUser = formData => {
  return axios.request({
    url: '/record/user/bindRecordUser',
    method: 'put',
    params:formData
  })
}
// 绑定业务号码(固话)联系人号码
export const getContactPhone = data => {
  return axios.request({
    url: '/record/user/getContactPhone',
    method: 'get',
    params:data
  })
}


// 移动成员
export const updateDeptCode = data => {
  return axios.request({
    url: '/member/updateDeptCode',
    method: 'put',
    data:data
  })
}

// 查询号码
export const getRecordUserList =formData => {
  return axios.request({
    url: '/record/user/getRecordUserList',
    method: 'get',
    params:formData
  })
}
// 修改别名
export const updateNickName =formData => {
  return axios.request({
    url: '/record/user/updateNickName',
    method: 'put',
    data:formData
  })
}

// 移动号码
export const updateRecordUser =formData => {
  return axios.request({
    url: '/record/user/updateRecordUser',
    method: 'put',
    data:formData
  })
}

// 数据统计
export const getRecorlist = formData => {
  return axios.request({
    url: '/recor/getrecorlist',
    method: 'post',
    data:formData
  })
}


//周期内统计 获取15天数据
export const getFifteenDayCallStatics =() => {
  return axios.request({
    url: '/recor/getFifteenDayCallStatics',
    method: 'post',
    data:{}
  })
}

//周期内统计
export const getMultipleDayCallStatics =formData => {
  return axios.request({
    url: '/recor/getMultipleDayCallStatics',
    method: 'post',
    data:formData
  })
}

//指定日期内统计
export const getOneDaySectionCallStatics =formData => {
  return axios.request({
    url: '/recor/getOneDaySectionCallStatics',
    method: 'post',
    data:formData
  })
}

//指定日期内统计 获取前一天天数据
export const getOneDayCallStatics =formData => {
  return axios.request({
    url: '/recor/getOneDayCallStatics',
    method: 'post',
    data:formData
  })
}
// 导出Excel  接收 文件流不能使用拦截器生成
// export const orderExport = formData => {
//   return axios.request({
//     url: '/recor/getExport',
//     method: 'post',
//     data:formData
//   })
// }

// 获取部门下拉列表

export const getDeptCodeList =() => {
  return axios.request({
    url: '/department/getDeptCodeList',
    method: 'get',
  })
}

// 获取部门信息列表

export const getDepartmentList =() => {
  return axios.request({
    url: '/department/getDepartmentList',
    method: 'get',
  })
}

// 编辑部门信息
export const updateDepartment =formData => {
  return axios.request({
    url: '/department/updateDepartment',
    method: 'put',
    data:formData
  })
}

// 添加新部门信息
export const addNewDepartment =formData => {
  return axios.request({
    url: '/department/addNewDepartment',
    method: 'post',
    data:formData
  })
}
// 添加新部门信息
export const addDepartment =formData => {
  return axios.request({
    url: '/department/addDepartment',
    method: 'post',
    data:formData
  })
}

// 删除部门信息
export const deleteDepartment = (departmentId) => {
  return axios.request({
    url: '/department/deleteDepartment?departmentId='+departmentId,
    method: 'delete',
  })
}

//获取通话记录 /por/call
export const getCallLogList =formData => {
  return axios.request({
    url: '/sh',
    method: 'get',
    params:formData
  })
}
//修改备注信息
export const updateRemark =formData => {
  return axios.request({
    url: '/sh/update',
    method: 'post',
    data:formData
  })
}


//删除通话记录 [{'rowKey':'123','indexRowKey':'1ww'}]
export const deleteCallLog =formData => {
  return axios.request({
    url: '/sh/evidence/delete',
    method: 'delete',
    data:formData
  })
}

//获取通话记录播放、下载的地址
export const getRecordPath =formData => {
  return axios.request({
    url: '/sh/download',
    method: 'get',
    params:formData
  })
}

//批量下载
export const callRecordMultipleDowload =formData => {
  return axios.request({
    url: '/ossdownload/callRecordMultipleDowload',
    method: 'post',
    data:formData
  })
}
// /ossdownload/callRecordMultipleDowload

export const loginYun =formData => {
  return axios.request({
    url: '/189/yun',
    method: 'get',
    params:formData
  })
}

// 云盘已满提示
export const isfull = () => {
  return axios.request({
    url: '/189/yun/isfull',
    method: 'get',
  })
}


// 云盘已满提示
export const capacityAlert = () => {
  return axios.request({
    url: '/sh/total/display',
    method: 'get',
  })
}


