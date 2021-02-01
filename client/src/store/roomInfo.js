import { setItem, getItem } from '@utils/localStorage';
import url from '@api/server.js';
import findLast from 'lodash/findLast';
import findLastIndex from 'lodash/findLastIndex';
import { group } from './group';

export const roomInfo = {
  state: {
    roomdetail: {}, // message
    roomUsers: [], // online user
    groupAllUsers: [],
  },
  getters: {
    getInfos: state => state.roomdetail.infos,
  },
  mutations: {
    delRoomDetailImg(state, data) {
      const { roomId, clientId } = data;
      const clientIndex = findLastIndex(state.roomdetail[roomId], {clientId});
      state.roomdetail[roomId].splice(clientIndex, clientIndex + 1);
    },
    setRoomDetailStatus(state, data) {
      const { groupId, status, clientId, typeList, newClientId } = data;
      console.log(groupId, state.roomdetail, clientId);
      const clientItem = findLast(state.roomdetail[groupId], { clientId });
      console.log(clientItem);
      typeList.map(item => {
        clientItem[item] = data[item];
      })
      // 重试
      if(newClientId) {
        clientItem.clientId = newClientId;
      }
    },
    setRoomDetailInfosAfter(state, data) {
      const { groupId, msgs } = data;
      console.log('groupId', groupId, msgs);
      if(!state.roomdetail[groupId]) {
        state.roomdetail[groupId] = [];
      }
      state.roomdetail[groupId].push(...msgs);
    },
    setRoomDetailInfosBeforeNoRefresh(state, {data, groupId}) {
      const list = state.roomdetail[groupId] || [];
      const newData = data.concat(list);
      state.roomdetail[groupId] = newData;
    },
    setRoomDetailInfosBefore(state, {data, groupId}) {
      const list = state.roomdetail[groupId] || [];
      const newData = data.concat(list);
      state.roomdetail = {
        ...(state.roomdetail),
        [groupId]: newData
      }
    },
    setRoomDetailInfos(state, {data, roomId}) {
      state.roomdetail.infos = data;
    },
    setAllmsg(state, data) {
      state.roomdetail = data;
    },
    setUsers(state, data) {
      const { roomId, onlineUsers } = data;
      state.roomUsers = {
        [roomId]: onlineUsers,
        ...(state.roomUsers)
      }
    },
    setGroupAllUsers(state, data) {
      state.groupAllUsers = data;
    }
  },
  actions: {
    async groupAllUsers({state, commit}, data) {
      const res = await url.getGroupUserList(data);
      commit('setGroupAllUsers', res);
    },
    async getRoomHistory({state, commit}, data) {
      const res = await url.getRoomHistory(data);
      commit('setAllmsg', res);
      // if(res.data.errno === 0) {
      //   const result = res.data.data;
      //   if(result) {
      //     commit('setAllmsg', result);
      //   }
      // }
    },
    async getAllMessHistory({state, commit}, data) {
      try {
        const res = await url.RoomHistoryAll(data);
        console.log(res);
        // res.data
        // if (res.data.errno === 0) {
          // const result = res.data;
          if(data.userId) {
            commit('setRoomDetailInfosBeforeNoRefresh', {
              data: res.data,
              groupId: data.groupId
            });
          } else {
            commit('setRoomDetailInfosBefore', {
              data: res.data,
              groupId: data.groupId
            });
          }

          return {
            data: res.data
          }
        // }
      } catch(e) {

      }
    },
  },
}

