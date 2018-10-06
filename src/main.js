// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import './styles/default.css';
// 使用museui组件
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import './styles/main.styl';
import socket from './socket';

import vuePicturePreview from 'vue-picture-preview';
Vue.use(vuePicturePreview);

Vue.use(MuseUI);
Vue.config.productionTip = false;

const Notification = window.Notification;

const popNotice = function(msgInfo) {
  if (Notification.permission === "granted") {
    let content = '';
    if (msgInfo.img !== '') {
      content = '[图片]';
    } else {
      content = msgInfo.msg;
    }
    const notification = new Notification(`【${msgInfo.roomid}】 提示`, {
        body: content,
        icon: msgInfo.src
    });
    notification.onclick = function() {
      notification.close();
    };
  }
};

socket.on('connect', () => {
  console.log('connect')
})

socket.on('disconnect', () => {
  console.log('disconnect');
})

socket.on('message', function (obj) {
  store.commit('addRoomDetailInfos', [obj]);
  console.log(Notification.permission);
  if (Notification.permission === "granted") {
    popNotice(obj);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      popNotice(obj);
    });
  }
})

document.addEventListener('touchstart', (e) => {
  if (e.target.className.indexOf('emoji') > -1 || e.target.parentNode.className.indexOf('emoji') > -1) {
    store.commit('setEmoji', true);
  } else {
    store.commit('setEmoji', false);
  }
})

document.addEventListener('click', (e) => {
  if (e.target.className.indexOf('emoji') > -1 || e.target.parentNode.className.indexOf('emoji') > -1) {
    store.commit('setEmoji', true);
  } else {
    store.commit('setEmoji', false);
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
