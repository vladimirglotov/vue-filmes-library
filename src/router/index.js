import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/Home'),
    beforeEnter (to, from, next) {
      store.getters.CHECK_USER ? next() : next('/login')
    }
  },
  {
    path: '/task',
    name: 'Task',
    component: () => import('../components/Task'),
    beforeEnter (to, from, next) {
      store.getters.CHECK_USER ? next() : next('/login')
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/Auth/Login')
  },
  {
    path: '/registration',
    name: 'Registration',
    component: () => import('../components/Auth/Registration')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
