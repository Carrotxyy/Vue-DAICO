import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from "../views/Home"
import ProjectList from "../views/ProjectList"


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
    component: ProjectList
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
