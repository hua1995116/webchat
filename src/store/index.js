/**
 * Created by Administrator on 2017/4/17.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import url from '../api/server.js'

// import qs from 'qs'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 存放用户
    socket: '',
    socketRoom: false,
    // 存放历史记录
    messhistory: {
      infos: [],
      allmessage: []
    },
    // 存放房间信息，为了方便以后做多房间
    roomdetail: {
      id: '',
      users: {},
      infos: []
    },
    // 存放机器人开场白
    robotmsg: [{
      message: 'Hi~有什么想知道的可以问我',
      user: 'robot'
    }],
    // svg
    svgmodal: null,
    // 是否启动tab
    istab: false
  },
  getters: {
    getSocketRoom: state => state.socketRoom,
    getSocket: state => state.socket,
    getUsers: state => state.roomdetail.users,
    getInfos: state => state.roomdetail.infos,
    getMessHistoryInfos: state => state.messhistory.infos,
    getMessHistoryAll: state => state.messhistory.allmessage,
    getRobotMsg: state => state.robotmsg
  },
  mutations: {
    setTab(state, data) {
      state.istab = data
    },
    setSvgModal(state, data) {
      state.svgmodal = data
    },
    setGetSocket (state, data) {
      state.socket = data
    },
    setSocketRoom (state, data) {
      state.socketRoom = data
    },
    addRoomDetailInfos(state, data) {
      state.roomdetail.infos.push(data)
    },
    setRoomDetailInfos(state) {
      state.roomdetail.infos = []
    },
    setUsers(state, data) {
      state.roomdetail.users = data
    },
    setAllMessHistory(state, data) {
      state.messhistory.allmessage = data
    },
    setMessHistoryInfos(state, data) {
      state.messhistory.infos = data
    },
    setRobotMsg(state, data) {
      state.robotmsg.push(data)
    }
  },
  actions: {
    async uploadImg({commit}, data) {
      const res = await url.postUploadFile(data)
      if (res) {
        if (res.data.errno === 0) {
          console.log('上传成功')
        }
      }
    },
    async registerSubmit({commit}, data) {
      const res = await url.RegisterUser(data)
      if (res.data.errno === 0) {
        return {
          status: 'success',
          data: res.data
        }
      }
      return {
        status: 'fail',
        data: res.data
      }
    },
    async loginSubmit({commit}, data) {
      const res = await url.loginUser(data)
      if (res.data.errno === 0) {
        return {
          status: 'success',
          data: res.data
        }
      }
      return {
        status: 'fail',
        data: res.data
      }
    },
    async getMessHistory({commit}, data) {
      const res = await url.RoomHistory(data)
      if (res) {
        commit('setMessHistoryInfos', res.data.data)
      }
    },
    async getAllMessHistory({commit}, data) {
      const res = await url.RoomHistoryAll(data)
      if (res.data.data.errno === 0) {
        return {
          data: res.data.data.data,
          total: res.data.data.total
        }
        // commit('setAllMessHistory', res.data.data.data)
      }
    },
    async getRobatMess({commit}, data) {
      let robotdata = ''
      const res = await url.getRobotMessage(data)
      if (res) {
        robotdata = JSON.parse(res.data.data)
        // 分类信息
        if (robotdata.code === 100000) {
          commit('setRobotMsg', {message: robotdata.text, user: 'robot'})
        } else if (robotdata.code === 200000) {
          let data = robotdata.text + robotdata.url
          commit('setRobotMsg', {message: data, user: 'robot'})
        } else if (robotdata.code === 302000) {
          commit('setRobotMsg', {message: '暂不支持此类对话', user: 'robot'})
        } else {
          commit('setRobotMsg', {message: '暂不支持此类对话', user: 'robot'})
        }
      }
    }
  }
})
export default store
