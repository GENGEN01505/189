import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import dynamicRoutes from './dynamicRoutes'
import adminRoutes from './adminRoutes'
import personalRoutes from './personalRoutes'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle,recursionRouter } from '@/libs/util'
import config from '@/config'
import Main from '@/components/main'
import parentView from '@/components/parent-view'
const { homeName } = config

Vue.use(Router)
const createRouter =()=>new Router({
  routes,
  mode: 'history'
})
var router = createRouter()
// 初始路由
export function resetRouter () {
  router = createRouter();
  window.sessionStorage.removeItem('userType');
  store.commit("setMenuList",router);
  store.commit("setBeforeRouter",[]);
  window.location.reload();
}


const LOGIN_PAGE_NAME = ['login','pan','passwordBack','register','agreement','helpWord','error_401','error_500','error_404']

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, router.options.routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

const initMenu=[
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]


// 动态加载路由
const setMenu = () => {
    if(store.state.user.hasGetMenu){
      if(store.state.user.menuList.length>0){
        let routerMenu=personalRoutes;
        if(store.state.user.userType==3){
          routerMenu=dynamicRoutes;
        }else if(store.state.user.userType==2){
          routerMenu=adminRoutes;
        }
        let getMenu= recursionRouter(store.state.user.menuList,routerMenu,initMenu);
        if(getMenu.length>0){
          store.commit("setBeforeRouter",getMenu);
          router.options.routes=routes.concat(getMenu)
          router.addRoutes(getMenu);
          store.commit("setMenuList",router);
        }
      }
    }else{
      var token = getToken()
      if(token){
        store.dispatch('getUserMenu').then(res => {
          var data =res.data.bizData;
          var userType=data.userType;
          var userType=data.userType;
          if(data.list.length>0){
            let routerMenu=personalRoutes;
            if(userType==3){
              routerMenu=dynamicRoutes;
            }else if(userType==2){
              routerMenu=adminRoutes;
            }
            let getMenu= recursionRouter(data.list,routerMenu,initMenu);
            if(getMenu.length>0){
              store.commit("setBeforeRouter",getMenu);
              router.options.routes=routes.concat(getMenu)
              router.addRoutes(getMenu);
              store.commit("setMenuList",router);
            }
          }

        }).catch((err) => {
           console.log(err)
        })
      }
    }
}
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

var isToken=getQueryString('token');
if(isToken){
  store.commit('setToken', "Bearer "+isToken);
}

if (store.state.app.beforRouter.length==0) {
  setMenu()
}
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  if (store.state.app.beforRouter.length==0) {
    if(LOGIN_PAGE_NAME.indexOf(to.name) == -1){
      // 未在白名单内 获取菜单
        setMenu()// 跳转
    }
  }
  const Token = getToken()
  if (!Token) {
      if(LOGIN_PAGE_NAME.indexOf(to.name) !== -1){
        // 未登陆且要跳转的页面在白名单内
        next() // 跳转
      }else{
        next({
          name: 'login' // 跳转到登录页
        })
      }
  } else{

    if (to.name === 'login') {// 已登录且要跳转的页面是登录页
        next({
        name: homeName // 跳转到homeName页
       })

    }else {
        if (store.state.user.hasGetInfo) {
          next() // 跳转
        } else {
          store.dispatch('getUserInfo').then(user => {
            var data=user.data;
            if(data.respCode==1000){
              if(data.activate=="8002"){
                next({name:"updatePassword"})
              }else{
                  // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
                next() // 跳转
              }
            }
          }).catch(err => {
            console.log(err)
            setToken('')
            next({name: 'login'})
          })
        }
     }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
