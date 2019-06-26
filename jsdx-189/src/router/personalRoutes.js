import Main from '@/components/main'
import parentView from '@/components/parent-view'
export default [
  {
    path: '/dataStatistics',
    name: 'dataStatistics',
    meta: {
      title:'数据统计',
      icon: 'ios-stats',
    },
    component: Main,
    children: [
      {
        path: 'data_Statistics',
        name: 'data_Statistics',
        meta: {
          icon: 'ios-stats',
          title: '总时长统计'
        },
        component: () => import('@/view/dataStatistics/dataStatistics.vue')
      },
      {
        path: 'week_Statistics',
        name: 'week_Statistics',
        meta: {
          icon: 'md-analytics',
          title: '周期内统计'
        },
        component: () => import('@/view/dataStatistics/weekStatistics.vue')
      },
      {
        path: 'count_Statistics',
        name: 'count_Statistics',
        meta: {
          icon: 'md-list',
          title: '指定日期统计'
        },
        component: () => import('@/view/dataStatistics/countTimeStatistics.vue')
      },
    ]
  },
  {
    path: '/notaryData',
    name: 'notaryData',
    meta: {
      title:'公证查询',
    },
    component: Main,
    children: [
      {
        path: 'notary_data',
        name: 'notary_data',
        meta: {
          icon: 'ios-archive',
          title: '公证查询'
        },
        component: () => import('@/view/notary/notary.vue')
      }
    ]
  },
  {
    path: '/orgMgt',
    name: 'orgMgt',
    meta: {
      icon: 'md-options',
      title: '组织维护',
    },
    component: Main,
    children: [
      {
        path: 'orgMgt_department',
        name: 'orgMgt_department',
        meta: {
          icon: 'md-git-branch',
          title: '部门管理',
          hideInMenu:true
        },
        component: () => import('@/view/orgMgt/department.vue')
      },
      {
        path: 'orgMgt_members',
        name: 'orgMgt_members',
        meta: {
          icon: 'md-people',
          title: '成员管理',
          hideInMenu:true
        },
        component: () => import('@/view/orgMgt/members.vue')
      },
       {
        path: 'orgMgt_callNum',
        name: 'orgMgt_callNum',
        meta: {
          icon: 'ios-apps',
          title: '业务号码',
        },
        component: () => import('@/view/orgMgt/callNum.vue')
      },

    ]
  },
  {
    path: '/userMgt',
    name: 'userMgt',
    meta: {
      icon: 'md-contact',
      title: '用户中心'
    },
    component: Main,
    children: [
      {
        path: 'userMgt_personalSet',
        name: 'userMgt_personalSet',
        meta: {
          icon: 'md-settings',
          title: '个人设置'
        },
        component: () => import('@/view/userMgt/personalSet.vue')
      },
      {
        path: 'userMgt_blacklist',
        name: 'userMgt_blacklist',
        meta: {
          icon: 'md-remove-circle',
          title: '黑名单'
        },
        component: () => import('@/view/userMgt/blacklist.vue')
      },
      {
        path: 'userMgt_logList',
        name: 'userMgt_logList',
        meta: {
          icon: 'md-bookmarks',
          title: '日志查询'
        },
        component: () => import('@/view/userMgt/logList.vue')
      },

    ]
  },

]
