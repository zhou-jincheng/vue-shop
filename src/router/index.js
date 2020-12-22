import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 页面视图
import Login from '../views/Login'
import Home from '../views/Home'

// 局部视图组件
import Welcome from '../components/Welcome'
import User from '../components/user/User'
import Rights from '../components/rights/Rights'
import Roles from '../components/rights/Roles'
import Cate from '../components/goods/Cate'
import Param from '../components/goods/Param'
import Good from '../components/goods/Good'
import Add from '../components/goods/Add'
import Order from '../components/order/Order'
import Report from '../components/report/Report'

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
    component: Home,
    redirect: '/home/welcome',
    children: [{
      path: "welcome",
      component: Welcome
    },{
      path: "users",
      component: User
    },{
      path: "rights",
      component: Rights
    },{
      path: "roles",
      component: Roles
    },{
      path: "categories",
      component: Cate
    },{
      path: "goods",
      component: Good
    },{
      path: "params",
      component: Param
    },{
      path: "add",
      component: Add
    },{
      path: "orders",
      component: Order
    },{
      path: "reports",
      component: Report
      
    }]
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
