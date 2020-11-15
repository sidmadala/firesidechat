import Vue from 'vue'
import App from './App.vue'
import { firestorePlugin } from 'vuefire'
import VueRouter from 'vue-router'

// composition api used to enable reuse of logic between components
import VueCompositionApi from '@vue/composition-api'

// attaching plugins to Vue application
Vue.use(VueCompositionApi)
Vue.use(VueRouter)
Vue.use(firestorePlugin)

// suppress warning when deployed in testing mode
Vue.config.productionTip = false

// import components used in router
import Home from './components/Home'
import ChatRoom from './components/ChatRoom'

// initializing router to route to home and chat screens based on chat id
const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/chats/:id', component: ChatRoom, name: 'chat' }
  ]
})

// initialize and mount Vue application
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
