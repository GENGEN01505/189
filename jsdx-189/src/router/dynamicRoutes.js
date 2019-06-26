import Main from '@/components/main'
import parentView from '@/components/parent-view'
export default[
  {
    path: '/dataStatistics',
    name: 'dataStatistics',
    meta: {
      icon: 'ios-stats',
      title:'数据统计'
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
