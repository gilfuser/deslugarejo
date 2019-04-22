import Vue from 'vue'
// import firebase from 'firebase'
// import { config } from './firebase'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
// import OscJs from './plugins/oscjs.js'

// Vue.use(OscJs)

Vue.config.productionTip = false

new Vue({
  router,
  created() {
        // firebase.initializeApp(config)
    },
  store,
  render: h => h(App)
}).$mount('#app')
