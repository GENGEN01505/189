import {
  login,
  logout,
  getUserInfo,
  getMenu,
} from '@/api/user'

import { setToken, getToken} from '@/libs/util'

export default {
  state: {
    userName: '',
    phone: '',
    email:'',
    idNumber:'',
    token: getToken(),
    access: '',
    userType:window.sessionStorage.getItem('userType')?window.sessionStorage.getItem('userType'):'',
    hasGetInfo: false,
    menuList:window.sessionStorage.getItem('menu') ? JSON.parse(window.sessionStorage.getItem('menu')):[],
    hasGetMenu:window.sessionStorage.getItem('menu') ?true:false,
  },
  mutations: {
    setIdNumber (state, idNumber) {
      state.idNumber = idNumber
    },
    setPhone(state, phone) {
      state.phone = phone
    },
    setUserType(state, userType) {
      state.userType = userType
    },
    setEmail(state, email) {
      state.email = email
    },
    setUserName (state, name) {
      state.userName = name
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMenu (state, menuList) {
      state.menuList = menuList
    },
    setHasGetMenu (state, menu) {
      state.hasGetMenu = menu
    },
  },
  getters: {
    // messageUnreadCount: state => state.messageUnreadList.length,
    // messageReadedCount: state => state.messageReadedList.length,
    // messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // 登录
    handleLogin ({ commit }, {phone, passWord,loginType,platform,smsCode}) {
      return new Promise((resolve, reject) => {
        login({
          phone,
          passWord,
          loginType,
          platform,
          smsCode
        }).then(res => {
          localStorage.removeItem('tagNaveList');
          var data=res.data;
          if(data.respCode==1000){
            const token ="Bearer "+data.authToken
            commit('setToken', token)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setMenu', []);
          localStorage.removeItem('tagNaveList');
          sessionStorage.removeItem('menu');
          window.sessionStorage.removeItem('alert');
          commit('setHasGetInfo', false);
          commit('setHasGetMenu', false);
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },

      // 退出登录
      webLogOut ({ state, commit }) {
        return new Promise(resolve => {
          commit('setToken', '')
          commit('setMenu', []);
          localStorage.removeItem('tagNaveList');
          sessionStorage.removeItem('menu');
          window.sessionStorage.removeItem('alert');
          commit('setHasGetInfo', false);
          commit('setHasGetMenu', false);
          resolve();
        });
      },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo().then(res => {
            const data = res.data
            commit('setIdNumber', data.idNumber)
            window.sessionStorage.setItem('userType',data.userType)
            commit('setUserType', data.userType)
            commit('setEmail', data.email)
            commit('setPhone', data.phone)
            if(data.idName=='null'||data.idName==null||data.idName==''){
              commit('setUserName', data.phone)
            }else{
              commit('setUserName', data.idName)
            }

            commit('setHasGetInfo', true)
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 获取菜单
    getUserMenu({ state, commit }) {
      return new Promise((resolve, reject) => {
          getMenu().then(res => {
            var data =res.data.bizData;
            if(data.list.length>0){
              window.sessionStorage.setItem('menu',JSON.stringify(data.list));
              window.sessionStorage.setItem('userType',data.userType)
              commit('setUserType', data.userType)
              commit('setMenu', data.list);
              commit('setHasGetMenu', true);
            }
            resolve(res)
          }).catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },





  }
}
