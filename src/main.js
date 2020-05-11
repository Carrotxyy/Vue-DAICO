import Vue from 'vue'
import elementUi from "element-ui"  
import "element-ui/lib/theme-chalk/index.css"
import App from './App.vue'
import router from './router/router'

Vue.use(elementUi)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
