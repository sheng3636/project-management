import Vue from 'vue'
import Router from 'vue-router'
import {
  getSessionStorage
} from '@/utils/index'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/dashboard'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/project',
    component: Layout,
    children: [
      {
        path: 'project',
        name: 'Member',
        component: () => import('@/views/project/project'),
        meta: {
          title: '项目',
          icon: 'project'
        }
      },
      {
        path: 'projectDashboard/:id(\\d+)',
        name: 'ProjectDashboard',
        component: () => import('@/views/project/projectDashboard'),
        meta: {
          title: '项目看板',
          activeMenu: '/project/project'
        },
        hidden: true
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    children: [
      {
        path: 'member',
        name: 'Member',
        component: () => import('@/views/member/member'),
        meta: {
          title: '用户列表',
          icon: 'user'
        }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

/**
 * 路由拦截器
 * 1.判断该路由是否需要登录权限
 * 2.通过vuex state获取当前的token是否存在
 * 3.将跳转的路由path作为参数，登录成功后跳转到该路由
 */
const whiteList = ['/login'] // 没有重定向白名单
router.beforeEach((to, from, next) => {
  const hasToken = getSessionStorage('token')
  // 当浏览器删掉路由时候，回退上一个路由路径
  if (hasToken) {
    if (to.path === '/login') {
      next({
        path: '/'
      })
    } else {
      next()
    }
  } else {
    // 没有令牌
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单，直接去
      next()
    } else {
      // 没有访问权限的其他页面被重定向到登录页面。
      next(`/login`)
    }
  }
})



// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
