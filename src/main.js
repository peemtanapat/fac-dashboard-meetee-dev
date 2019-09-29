import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import server from './server'
import VueNativeSock from 'vue-native-websocket'
// import VueWebsocket from "vue-websocket";
const URL = [
  "ws://localhost:9001", //0
  "ws://18.139.12.132:9001" //1
];
Vue.config.productionTip = false

// Vue.use(VueWebsocket, "ws://localhost:9001");
Vue.use(VueNativeSock, URL[1], {
  // Vue.use(VueNativeSock, 'ws://localhost:9001', {
  store: store
})

new Vue({
  router,
  store,
  server,
  render: h => h(App)
}).$mount('#app')