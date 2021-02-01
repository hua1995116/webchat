// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router/index';
import store from './store/index1';
import './styles/reset.css';
import './styles/default.css';
// 使用museui组件
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import './styles/main.styl';
import socket from './socket';
import {queryString} from '@utils/queryString';
import {getRoomInfo} from '@utils/cache';
import env from '@utils/env';
import Toast from "@components/Toast";
import Alert from "@components/Alert";
import { handleInit } from './socket-handle';

import vuePicturePreview from './components/photo-viewer';
import imgSize from './directive/imgSize';
import flexTouch from "vue-flex-touch";

Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})

Vue.use(vuePicturePreview);
Vue.use(imgSize);
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

socket.on('reconnect', async (attemptNumber) => {
  console.log('reconnect');
  Toast({
    content: '又可以愉快地上网啦',
    timeout: 2000,
    background: "#f44336"
  });
});


socket.on('connect', async () => {
  console.log('connect');
  // const roomId = queryString(window.location.href, 'roomId');
  const username = store.state.userInfo.username;
  const avatar = store.state.userInfo.avatar;
  const userId = store.state.userInfo.userId;
  if (userId) {
    await store.dispatch('getGroupList', { userId });
    const groupList = store.state.group.groupList;
    // 此处逻辑需要抽离复用
    await handleInit({
      username,
      userId,
      avatar,
      groupList
    })
  }
});

socket.on('disconnect', () => {
  console.log('disconnect');
  Toast({
    content: '抱歉网络开了小差',
    timeout: 2000,
    background: "#f44336"
  });
  store.commit('setDiscount', true);
});

socket.on('message', function (obj) {
  const userIdLocal = store.state.userInfo.userId;
  const { groupId, userId, msgType, clientId, msg } = obj;
  if(userIdLocal === userId) {
    if(msgType === 'img') {
      console.log('img', obj);
      store.commit('setRoomDetailStatus', {
        clientId,
        groupId,
        status: 'finish',
        loading: 100,
        img: msg,
        typeList: ['status', 'loading', 'img']
      })
    } else {
      store.commit('setRoomDetailStatus', {
        clientId,
        groupId,
        status: 'finish',
        typeList: ['status']
      })
    }

  } else {
    store.commit('setRoomDetailInfosAfter', {
      groupId,
      msgs: [obj]
    });
    if (Notification.permission === "granted") {
      popNotice(obj);
    }
  }

});

socket.on('count', (obj) => {
  console.log(obj);
  // store.commit("setUnread", obj);
})

socket.on('room', (obj) => {
  console.log(obj);
  store.commit('setUsers', obj);
});
socket.on('roomout', (obj) => {
  console.log(obj);
  store.commit('setUsers', obj);
});
socket.on('friend', (obj) => {
  store.commit('setFriendList', obj);
})

// document.addEventListener('touchstart', (e) => {
//   if(!e.target.className) {
//     return;
//   }
//   console.log(e.target.className);
//   if (e.target.className.indexOf('emoji') > -1 || e.target.parentNode.className.indexOf('emoji') > -1) {
//     store.commit('setEmoji', true);
//   } else {
//     store.commit('setEmoji', false);
//   }
// });

// document.addEventListener('click', (e) => {
//   if(!e.target.className) {
//     return;
//   }
//   if (e.target.className.indexOf('emoji') > -1 || e.target.parentNode.className.indexOf('emoji') > -1) {
//     store.commit('setEmoji', true);
//   } else {
//     store.commit('setEmoji', false);
//   }
// });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});
