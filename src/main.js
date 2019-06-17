import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import index from '@/styles/index.less'
import router from '../router.js'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(ElementUI)
Vue.use(index)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  var token = localStorage.getItem('itcastpro_token')
  if (token || to.path === '/login') {
    console.log(11)
    next()
  } else {
    console.log(22)
    next({ name: 'Login' })
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
