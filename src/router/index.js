import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import Users from '../components/user/Users.vue'
import power from '../components/power/power.vue'
import roles from '../components/power/roles.vue'
import goodCate from '../components/goods/goodCate.vue'
import goodParams from '../components/goods/goodParams.vue'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: power },
      { path: '/roles', component: roles },
      { path: '/categories', component: goodCate },
      { path: '/params', component: goodParams }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // to 表示访问的路径
  // from 代表从那个路径跳转而来
  // next 表示放行
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
