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

// 引入富文本编辑器依赖
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 全局注册
Vue.use(VueQuillEditor, /* { default global options } */)


//定义全局过滤器，处理时间
Vue.filter('dateFormat', res => {
  let date = new Date(res);
  let y = date.getFullYear();
  let M = (date.getMonth() + 1).toString().padStart(2, '0');
  let d = date.getDay().toString().padStart(2, '0');

  let h = date.getHours().toString().padStart(2, '0');
  let m = date.getMinutes().toString().padStart(2, '0');
  let s = date.getSeconds().toString().padStart(2, '0')

  return `${y}-${M}-${d} ${h}:${m}:${s}`
})

//阻止启动生产消息
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
