import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 页面视图
import Login from '../views/Login'
import Home from '../views/Home'

// 局部视图组件
import Welcome from '../components/Welcome'
import User from '../components/user/User'

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
