import Vue from 'vue'
import elementUi from "element-ui"  
import "element-ui/lib/theme-chalk/index.css"
import App from './App.vue'
import router from './router/router'
import web3 from "@/libs/connectWeb3"

Vue.use(elementUi)
Vue.config.productionTip = false

// 监听所有路由的动态
router.beforeEach(async(to,from,next)=>{
  // 判断当前路由是否需要进行登录验证
  if(to.matched.some(res => res.meta.requireAuth)){
    if(Vue.prototype.$account && web3){
      // 已经登录！
      web3.eth.getAccounts()
              .then(res=>{
                if(res[0] === Vue.prototype.$account){
                  next()
                }else{
                  // 切换了账号,重新登录
                  next({
                    path : "/",
                    query: {redirect: to.fullPath} // 登陆成功后回到当前页面，这里传值给login页面，to.fullPath为当前点击的页面
                  })
                }
              })
    }else{
      // 未登录
      next({
        path : "/",
        query: {redirect: to.fullPath} // 登陆成功后回到当前页面，这里传值给login页面，to.fullPath为当前点击的页面
      })
    }
  }else{
    // 如果不需要则直接跳转
    next()
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
