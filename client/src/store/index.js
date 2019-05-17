/**
 * Created by Administrator on 2017/4/17.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import url from '@api/server.js';
import {setItem, getItem} from '@utils/localStorage';
import {ROBOT_NAME, ROBOT_URL} from '@const/index';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userInfo: {
      src: getItem('src'),
      userid: getItem('userid')
    },
    isDiscount: false,
    isLogin: false,
    // 存放房间信息，为了方便以后做多房间
    roomdetail: {
      id: '',
      users: {},
      infos: [],
      current: 1,
      total: 0
    },
    // 存放机器人开场白
    robotmsg: [
    {
      id: 1,
      username: ROBOT_NAME,
      src: ROBOT_URL,
      msg: '如果微信群过期了,添加作者微信(添加时记得备注:项目交流)'
    },
    {
      id: 2,
      username: ROBOT_NAME,
      src: ROBOT_URL,
      img: "https://s3.qiufengh.com/webchat/webcaht-my.jpeg"
    },
    {
      id: 3,
      username: ROBOT_NAME,
      src: ROBOT_URL,
      msg: '期待你的加入'
    },
    {
      id: 4,
      username: ROBOT_NAME,
      src: ROBOT_URL,
      img: "https://s3.qiufengh.com/webchat/webchat-group.jpeg"
    },
    {
      id: 5,
      username: ROBOT_NAME,
      src: ROBOT_URL,
      msg: '如果还有什么想知道的可以问我'
    }],
    unRead: {
      room1: 0,
      room2: 0
    },
    // svg
    svgmodal: null,
    // 是否启动tab
    istab: false,

    emojiShow: false
  },
  getters: {
    getTotal: state => state.roomdetail.total,
    getCurrent: state => state.roomdetail.current,
    getUsers: state => state.roomdetail.users,
    getInfos: state => state.roomdetail.infos,
    getRobotMsg: state => state.robotmsg,
    getEmoji: state => state.emojiShow
  },
  mutations: {
    setTotal(state, value) {
      state.roomdetail.total = value;
    },
    setDiscount(state, value) {
      state.isDiscount = value;
    },
    setCurrent(state, value) {
      state.roomdetail.current = value;
    },
    setUnread(state, value) {
      for (let i in value) {
        state.unRead[i] = +value[i];
      }
    },
    setLoginState(state, value) {
      state.isLogin = value;
    },
    setUserInfo(state, data) {
      const {type, value} = data;
      setItem(type, value);
      state.userInfo[type] = value;
    },
    setEmoji(state, data) {
      state.emojiShow = data;
    },
    setTab(state, data) {
      state.istab = data;
    },
    setSvgModal(state, data) {
      state.svgmodal = data;
    },
    addRoomDetailInfos(state, data) {
      state.roomdetail.infos.push(...data);
    },
    addRoomDefatilInfosHis(state, data) {
      const list = state.roomdetail.infos;
      state.roomdetail.infos = data.concat(list);
    },
    setRoomDetailInfos(state) {
      state.roomdetail.infos = [];
    },
    setUsers(state, data) {
      state.roomdetail.users = data;
    },
    setRobotMsg(state, data) {
      state.robotmsg.push(data);
    }
  },
  actions: {
    async uploadAvatar({}, data) {
      const res = await url.postUploadAvatar(data);
      return res.data;
    },
    async uploadImg({}, data) {
      const res = await url.postUploadFile(data);
      if (res) {
        if (res.data.errno === 0) {
          console.log('上传成功');
        }
      }
    },
    async registerSubmit({}, data) {
      const res = await url.RegisterUser(data);
      if (res.data.errno === 0) {
        return {
          status: 'success',
          data: res.data
        };
      }
      return {
        status: 'fail',
        data: res.data
      };
    },
    async loginSubmit({}, data) {
      const res = await url.loginUser(data);
      if (res.data.errno === 0) {
        return {
          status: 'success',
          data: res.data
        };
      }
      return {
        status: 'fail',
        data: res.data
      };
    },
    async getAllMessHistory({state, commit}, data) {
      const res = await url.RoomHistoryAll(data);
      if (res.data.data.errno === 0) {
        commit('addRoomDefatilInfosHis', res.data.data.data);
        if (!state.roomdetail.total) {
          commit('setTotal', res.data.data.total);
        }
      }
    },
    async getRobatMess({commit}, data) {
      const username = ROBOT_NAME;
      const src = ROBOT_URL;
      const res = await url.getRobotMessage(data);
      if (res) {
        const robotdata = JSON.parse(res.data.data);
        let msg = '';
        // 分类信息
        if (robotdata.code === 100000) {
          msg = robotdata.text;
        } else if (robotdata.code === 200000) {
          msg = robotdata.text + robotdata.url;
        } else {
          msg = '暂不支持此类对话';
        }
        commit('setRobotMsg', {msg, username, src});
      }
    }
  }
});
export default store;
