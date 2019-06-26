import axios from '@/libs/api.request'
// 添加申请公证信息
export const addNotary =formData => {
  return axios.request({
    url: '/notary/addNotary',
    method: 'post',
    data:formData
  })
}


// 获公证处信息

export const getNppList =() => {
  return axios.request({
    url: '/notary/getNppList',
    method: 'get',
  })
}

// 获取部门下拉列表

export const getNotary =formData => {
  return axios.request({
    url: '/notary/getNotary',
    method: 'get',
    params:formData
  })
}
