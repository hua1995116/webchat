/**
 * Created by Administrator on 2017/4/17.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 存放用户
    user: {
      name: '',
      src: ''
    },
    // 存放历史记录
    messhistory: {
      infos: []
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
    // 聊天页面显示控制
    chattoggle: false,
    // 登录页面显示控制
    logintoggle: false,
    // 注册页面显示控制
    registertoggle: true,
    // 提示框显示控制
    dialog: false,
     // 提示框内容
    dialoginfo: ''
  },
  getters: {
    getid: state => state.roomdetail.id,
    getusers: state => state.roomdetail.users,
    getinfos: state => state.roomdetail.infos,
    getchattoggle: state => state.chattoggle,
    getlogintoggle: state => state.logintoggle,
    getregistertoggle: state => state.registertoggle,
    getdialog: state => state.dialog,
    getdialoginfo: state => state.dialoginfo,
    getusername: state => state.user.name,
    getusersrc: state => state.user.src,
    getmesshistoryinfos: state => state.messhistory.infos,
    getrobotmsg: state => state.robotmsg
  },
  mutations: {
    changechattoggle(state) {
      state.chattoggle = !state.chattoggle
    },
    openlogintoggle(state) {
      state.logintoggle = true
    },
    closelogintoggle(state) {
      state.logintoggle = false
    },
    openregistertoggle(state) {
      state.registertoggle = true
    },
    closeregistertoggle(state) {
      state.registertoggle = false
    },
    changedialog(state) {
      state.dialog = !state.dialog
    },
    changedialoginfo(state, data) {
      state.dialoginfo = data
    },
    setusername(state, data) {
      state.user.name = data
    },
    setusersrc(state, data) {
      state.user.src = data
    },
    addroomdetailinfos(state, data) {
      state.roomdetail.infos.push(data)
    },
    setusers(state, data) {
      state.roomdetail.users = data
    },
    setmesshistoryinfos(state, data) {
      state.messhistory.infos = data
    },
    setrobotmsg(state, data) {
      state.robotmsg.push(data)
    }
  },
  actions: {
    registersubmit({commit}, data) {
      console.log(data)
      axios.post('/user/signup', data)
        .then(function (data) {
          if (data.data.errno === 0) {
            commit('closeregistertoggle')
            commit('openlogintoggle')
            commit('changedialog')
            commit('changedialoginfo', data.data.data)
          } else {
            commit('changedialog')
            commit('changedialoginfo', data.data.data)
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    loginsubmit({commit}, data) {
      axios.post('/user/signin', data)
        .then(function (data) {
          if (data.data.errno === 0) {
            commit('closelogintoggle')
            commit('changedialog')
            commit('changedialoginfo', data.data.data)
            commit('setusername', data.data.name)
            commit('setusersrc', data.data.src)
          } else {
            commit('changedialog')
            commit('changedialoginfo', data.data.data)
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    getmesshistory({commit}) {
      axios.get('/message')
        .then(function (data) {
          commit('setmesshistoryinfos', data.data.data)
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    getrobatmess({commit}, data) {
      var robotdata = ''
      axios.get('/robotapi', {
        params: data
      })
        .then(function (data) {
          robotdata = JSON.parse(data.data.data)
          // 分类信息
          if (robotdata.code === 100000) {
            commit('setrobotmsg', {message: robotdata.text, user: 'robot'})
          } else if (robotdata.code === 200000) {
            let data = robotdata.text + robotdata.url
            commit('setrobotmsg', {message: data, user: 'robot'})
          } else if (robotdata.code === 302000) {
            commit('setrobotmsg', {message: '暂不支持此类对话', user: 'robot'})
          } else {
            commit('setrobotmsg', {message: '暂不支持此类对话', user: 'robot'})
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    }
  }
})
export default store
