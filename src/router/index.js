import Vue from 'vue'
import Router from 'vue-router'

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
    component: () => import('@/views/login/index'),
    meta: { title: '登录' },
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    meta: { title: '404' },
    hidden: true
  },
  // 仪表盘
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  // 个人中心
  {
    path: '/profile',
    component: Layout,
    children: [{
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/profile/index'),
      meta: { title: '个人中心', icon: 'profile' }
    }],
    hidden: true
  },

  // 首页管理
  {
    path: '/home',
    component: Layout,
    redirect: '/home/banner',
    name: 'Home',
    meta: { title: '首页管理', icon: 'lunbo' },
    children: [
      {
        path: 'banner',
        name: 'HomeBanner',
        component: () => import('@/views/hm_banner/hmbanner_list'),
        meta: { title: '轮播管理', icon: 'lunbo' }
      }
    ]
  },
  // 课程管理
  {
    path: '/course',
    component: Layout,
    redirect: '/course/list',
    name: 'Course',
    meta: { title: '课程管理', icon: 'course' },
    children: [
      {
        path: 'list',
        name: 'CourseList',
        component: () => import('@/views/edu_course/educourse_list'),
        meta: { title: '课程列表', icon: 'list' }
      },
      {
        path: 'audit',
        name: 'CourseAudit',
        component: () => import('@/views/edu_course/educourse_audit'),
        meta: { title: '课程审核', icon: 'audit' }
      },
      {
        path: 'subject',
        name: 'CourseSubject',
        component: () => import('@/views/edu_subject/edusubject_list'),
        meta: { title: '分类管理', icon: 'category' }
      }
    ]
  },
  // 讲师管理
  {
    path: '/tch',
    component: Layout,
    redirect: '/tch/list',
    name: 'Tch',
    meta: { title: '讲师管理', icon: 'teacher' },
    children: [
      {
        path: 'list',
        name: 'TchList',
        component: () => import('@/views/edu_teacher/eduteacher_list'),
        meta: { title: '讲师列表', icon: 'list' }
      },
      {
        path: 'audit',
        name: 'TchAudit',
        component: () => import('@/views/edu_teacher/eduteacher_audit'),
        meta: { title: '讲师审核', icon: 'audit' }
      }
    ]
  },

  // 学员管理
  {
    path: '/uctr',
    component: Layout,
    redirect: '/uctr/list',
    name: 'Uctr',
    meta: { title: '学员管理', icon: 'student' },
    children: [
      {
        path: 'list',
        name: 'UctrList',
        component: () => import('@/views/uctr_member/uctrmember_list'),
        meta: { title: '学员管理', icon: 'student' }
      }
    ]
  },
  // 系统管理
  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/user',
    name: 'Sys',
    meta: { title: '系统管理', icon: 'sys' },
    children: [
      {
        path: 'user',
        name: 'SysUser',
        component: () => import('@/views/acl_user/acluser_list'),
        meta: { title: '用户管理', icon: 'user' }
      }
    ]
  },
  // 订单管理
  {
    path: '/order',
    component: Layout,
    name: 'Order',
    meta: { title: '订单管理', icon: 'el-icon-s-order' },
    children: [
      {
        path: 'list',
        name: 'orderList',
        component: () => import('@/views/t_order/torder_list'),
        meta: { title: '订单管理', icon: 'el-icon-s-order' }
      }
    ]
  }
]

// 动态路由，根据用户角色分配
export const asyncRoutes = [

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
