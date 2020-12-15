import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 引入公共css样式
import './assets/css/base.css'

// 引入字体图标
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
