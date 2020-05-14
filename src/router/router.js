import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from "../views/Home"
import ProjectList from "../views/ProjectList"
import DevProjectCenter from "../views/DevProjectCenter"

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/project-hall',
    name: 'ProjectList',
    meta: {
      requireAuth: true // 配置此条，进入页面前判断是否需要登陆
    },
    component: ProjectList
  },
  {
    path: '/developer/project-centre',
    name: 'DevProjectCenter',
    meta: {
      requireAuth: true // 配置此条，进入页面前判断是否需要登陆
    },
    component: DevProjectCenter
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
