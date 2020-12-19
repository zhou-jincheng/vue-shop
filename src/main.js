import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 引入公共css样式
import './assets/css/base.css'

// 引入字体图标
import './assets/fonts/iconfont.css'

// 引入依赖vue-table-with-tree-grid
import ZKTable from 'vue-table-with-tree-grid'
// 全局注册该依赖
Vue.component('treeTable', ZKTable)

//阻止启动生产消息
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
