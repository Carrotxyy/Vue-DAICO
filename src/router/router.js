import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from "../views/Home"
import ProjectList from "../views/ProjectList"
import DevProjectCenter from "../views/DevProjectCenter"
import DevApply from "../views/DevApply"
import InvProjectCenter from "../views/InvProjectCenter"
import InvTap from "../views/InvTap"

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
  },
  {
    path: '/developer/apply',
    name: 'DevApply',
    meta: {
      requireAuth: true // 配置此条，进入页面前判断是否需要登陆
    },
    component: DevApply
  },
  {
    path: '/investor/project-centre',
    name: 'InvProjectCenter',
    meta: {
      requireAuth: true // 配置此条，进入页面前判断是否需要登陆
    },
    component: InvProjectCenter
  },
  {
    path: '/investor/tap',
    name: 'InvTap',
    meta: {
      requireAuth: true // 配置此条，进入页面前判断是否需要登陆
    },
    component: InvTap
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
