import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Robot from '@/components/Robot'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/robot',
      name: 'Robot',
      component: Robot
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    }
  ]
})
