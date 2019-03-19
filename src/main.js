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
import {queryString} from '@utils/queryString';

import vuePicturePreview from './components/photo-viewer';
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

socket.on('connect', async () => {
  console.log('connect');
  const roomId = queryString(window.location.href, 'roomId');
  const userId = store.state.userInfo.userid;
  if (userId) {
    socket.emit('login', {name: userId});
  }
  if (roomId) {
    const obj = {
      name: userId,
      src: store.state.userInfo.src,
      roomid: roomId
    };
    socket.emit('room', obj);

    if (store.state.isDiscount) {
      await store.commit('setRoomDetailInfos');
      await store.commit('setCurrent', 1);
      await store.commit('setDiscount', false);
      await store.commit('setTotal', 0);
      await store.dispatch('getAllMessHistory', {
        current: 1,
        roomid: roomId
      });
    }
  }
});

socket.on('disconnect', () => {
  console.log('disconnect');
  store.commit('setDiscount', true);
});

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
});

document.addEventListener('touchstart', (e) => {
  if (e.target.className.indexOf('emoji') > -1 || e.target.parentNode.className.indexOf('emoji') > -1) {
    store.commit('setEmoji', true);
  } else {
    store.commit('setEmoji', false);
  }
});

document.addEventListener('click', (e) => {
  if (e.target.className.indexOf('emoji') > -1 || e.target.parentNode.className.indexOf('emoji') > -1) {
    store.commit('setEmoji', true);
  } else {
    store.commit('setEmoji', false);
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});
