import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Circulate from '@/views/circulate.vue'
import Transfer from '@/views/transfer.vue'
import WorkflowManage from '@/views/workflowManage.vue'
import detail from '@/views/detail.vue'
import createProcess from '@/views/createProcess.vue'
import groupManage from '@/views/groupManage.vue'
import searchGroup from '@/views/searchGroup.vue'
import selectUser from '@/views/selectUser.vue'
import Cookies from 'js-cookie'
const cookieKey = 'ss_id'
import { goLogin } from '@/api/common'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/workflowManage',
    meta: {
      title: '流程管理',
      keepAlive: true
    },
  },
  {
    path: '/detail',
    name: 'detail',
    meta: {
      title: '流程详情',
      keepAlive: true
    },
    component: detail,
  },
  {
    path: '/circulate',
    name: 'circulate',
    meta: {
      title: '分阅',
    },
    component: Circulate,
  },
  {
    path: '/transfer',
    name: 'transfer',
    meta: {
      title: '转办',
    },
    component: Transfer,
  },
  {
    path: '/workflowManage',
    name: 'workflowManage',
    meta: {
      title: '流程管理',
      keepAlive: true
    },
    component: WorkflowManage,
  },  
  {
    path: '/createProcess',
    name: 'createProcess',
    meta: {
      title: '发起页面',
      keepAlive: true
    },
    component: createProcess,
  },
  {
    path: '/groupManage',
    name: 'groupManage',
    meta: {
      title: '分组',
      keepAlive: true
    },
    component: groupManage,
  },
  {
    path: '/searchGroup',
    name: 'searchGroup',
    meta: {
      title: '分组搜索',
      keepAlive: true
    },
    component: searchGroup,
  },
  {
    path: '/selectUser',
    name: 'selectUser',
    meta: {
      title: '选择人员',
    },
    component: selectUser,
  }

]
const router = createRouter({
  history: createWebHistory('/flow-h5/'),
  routes,
})

/* 路由发生变化修改页面title */
router.beforeEach((to, from, next) => {
  if (typeof to.meta?.title === 'string') {
    document.title = to.query.title ? (Array.isArray(to.query.title) ? to.query.title.join('') : to.query.title) : to.meta?.title;
  }
  // 如果有code,就去登录下,并且去掉code
  if (to.query.code) {
    const { query, ...rest } = to
    const id = import.meta.env.VITE_APP_AGENT_ID
    goLogin({ code: to.query.code, agentId: id, userTypes: 'E,O' })
    .then(
      (res: any) => {
        // 存储用户信息
        const userInfo: any = {
          userId: res.data.user.id,
          userName: res.data.user.name,
          // 添加公司属性
          companyName: res.data.user.company.name,
          companyId: res.data.user.company.id,
          userType: res.data.user.userType
        }
        for (const key in userInfo) {
          const value = userInfo[key]
          const storageKey = 'userInfo.' + key
          localStorage.setItem(storageKey, value)
        }
        // 登录态有效为两小时
        const TWO_HOURS = 120 * 60 * 1000
        const expiresDate = new Date(new Date().getTime() + TWO_HOURS)
        Cookies.set(cookieKey, res.data.token, {
          expires: expiresDate,
        })
        const finalQuery: any = {}
        for (const queryKey in query) {
          if (queryKey !== 'code' && queryKey !== 'state') {
            finalQuery[queryKey] = query[queryKey]
          }
        }
        router.replace({
          ...rest,
          query: finalQuery,
        })
        next()
      }
    )
  } else {
    const pathFrom = from.path
    const pathTo = to.path
    window.pathFrom = pathFrom
    window.pathTo = pathTo
    next()
  }
})

export default router
