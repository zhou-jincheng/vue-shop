import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Login from '../views/Login'
import Home from '../views/Home'



const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

//设置路由前置守卫，确保有权限的页面无法被没权限的访问
router.beforeEach((to, from, next) => {
  if(to.path === "/login") return next();
  const token = window.sessionStorage.getItem("token");
  if(!token) return next({path: "/login", replace: true});
  next()
})

export default router
