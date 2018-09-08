// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './styles/default.css'
// 使用museui组件
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import './styles/main.styl'
import socket from './socket'
Vue.use(MuseUI)
Vue.config.productionTip = false

socket.on('connect', () => {
  console.log('connect')
})

socket.on('disconnect', () => {
  console.log('disconnect');
})

socket.on('message', function (obj) {
  console.log(obj);
  store.commit('addRoomDetailInfos', [obj])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
