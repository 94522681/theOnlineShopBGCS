import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import Users from '../components/user/Users.vue'
import power from '../components/power/power.vue'
import roles from '../components/power/roles.vue'
import goodsCate from '../components/goods/goodCate.vue'
import goodsParams from '../components/goods/goodParams.vue'
import goodsList from '../components/goods/goodsList.vue'
import add from '../components/goods/add.vue'
import order from '../components/order/order.vue'
Vue.use(VueRouter)
Vue.filter('time_format', val => {
  var data = new Date(val)
  var y = data.getFullYear()
  var m = data.getMonth()
  var d = data.getDate()
  var h = data.getHours()
  var mt = data.getMinutes()
  var s = data.getSeconds()
  return `${y}-${m}-${d}  ${h}:${mt}:${s}`
})
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
      { path: '/categories', component: goodsCate },
      { path: '/params', component: goodsParams },
      { path: '/goods', component: goodsList },
      { path: '/goods/add', component: add },
      { path: '/orders', component: order }
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
