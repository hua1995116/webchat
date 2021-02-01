import { setItem, getItem } from '@utils/localStorage';
import url from '@api/server.js';

export const friendInfo = {
  state: {
    friendList: [],
  },
  mutations: {
    setFriendList(state, data) {
      state.friendList = data;
    },
  },
  actions: {
    async postListFriend({state, commit}, data) {
      const res = await url.postListFriend(data);
      commit('setFriendList', res);
    },
    async addFriend({}, data) {
      const res = await url.postAddFriend(data);
      return res;
    },
  },
}