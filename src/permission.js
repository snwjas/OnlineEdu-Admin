import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import { Message } from 'element-ui'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const isLogin = Object.keys(store.getters.user).length !== 0
  if (isLogin) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 生成可访问的路由表
      if (store.getters.addRouters.length === 0) {
        generateRoutes()
        next({ ...to, replace: true })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      try {
        // logged in, get user info
        await store.dispatch('user/getInfo')
        // 生成可访问的路由表
        if (store.getters.addRouters.length === 0) {
          generateRoutes()
          next({ ...to, replace: true })
        } else {
          next()
        }
      } catch (error) {
        Message.error(error || 'Has Error')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

function generateRoutes() {
  const roles = [store.getters.user.roleId]
  store.dispatch('GenerateRoutes', { roles }).then(() => {
    // 动态添加可访问路由表
    router.options.routes = store.getters.routers
    router.addRoutes([...store.getters.addRouters])
  })
  // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
  // next({ ...to, replace: true })
}
