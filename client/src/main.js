// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router/index';
import store from './store';
import './styles/reset.css';
import './styles/default.css';
// 使用museui组件
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import './styles/main.styl';
import socket from './socket';
import {queryString} from '@utils/queryString';
import {getRoomInfo} from '@utils/cache';

import vuePicturePreview from './components/photo-viewer';
import flexTouch from "vue-flex-touch";

Vue.use(vuePicturePreview);
Vue.use(flexTouch, { timeout: 900, preventDefault: false });
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
  const userName = store.state.userInfo.userid;
  const userId = store.state.userInfo.id;
  if (userId) {
    socket.emit('login', {name: userName, id: userId});
  }
  if (roomId) {
    const obj = {
      name: userName,
      id: userId,
      src: store.state.userInfo.src,
      roomid: roomId
    };
    socket.emit('room', obj);

    if (store.state.isDiscount) {
      const {total, current} = getRoomInfo(roomId);
      await store.commit('setDiscount', false);
      await store.dispatch('getAllMessHistory', {
        current: current + 1,
        roomid: roomId,
        total: total
      });
    }
  }
});

socket.on('disconnect', () => {
  console.log('disconnect');
  store.commit('setDiscount', true);
});

socket.on('message', function (obj) {
  store.commit('setRoomDetailInfosAfter', [obj]);
  console.log(Notification.permission);
  if (Notification.permission === "granted") {
    popNotice(obj);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      popNotice(obj);
    });
  }
});

socket.on('room', (obj) => {
  store.commit('setUsers', obj);
});
socket.on('roomout', (obj) => {
  store.commit('setUsers', obj);
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
