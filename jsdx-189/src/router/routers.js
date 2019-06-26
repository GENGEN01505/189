import Main from '@/components/main'
import parentView from '@/components/parent-view'
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default[
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
 
  {
    path: '/pan',
    name: 'pan',
    meta: {
      title: 'Pan - 云盘登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/loginYun.vue')
  },
  {
    path: '/passwordBack',
    name: 'passwordBack',
    meta: {
      title: '找回密码',
      hideInMenu: true
    },
    component: () => import('@/view/login/passwordBack.vue')
  },
  {
    path: '/updatePassword',
    name: 'updatePassword',
    meta: {
      title: '修改密码',
      hideInMenu: true
    },
    component: () => import('@/view/login/updatePassword.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    meta: {
      hideInBread: true,
      title: '通话记录'
    },
    component: Main,
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          icon: 'ios-call',
          title: '通话记录'
        },
        component: () => import('@/view/callLog/callLog.vue')
      }
    ]
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: '注册',
      hideInMenu: true
    },
    component: () => import('@/view/login/register.vue')
  },
  {
    path: '/agreement',
    name: 'agreement',
    meta: {
      title: '用户注册协议',
      hideInMenu: true
    },
    component: () => import('@/view/login/agreement.vue')
  },
  {
    path: '/helpWord',
    name: 'helpWord',
    meta: {
      title: '帮助文档',
      hideInMenu: true
    },
    component: () => import('@/view/login/helpWord.vue')
  },

  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
]

