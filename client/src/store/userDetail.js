import { setItem, getItem } from '@utils/localStorage';
import url from '@api/server.js';

export const userDetail = {
  state: {
    user: {}
  },
  mutations: {
    setLookUserInfo(state, data) {
      state.user = data;
    },
  },
  actions: {
    async getUserInfo({state, commit}, data) {
      const res = await url.getUserInfo(data);
      console.log(res);
      commit('setLookUserInfo', res);
    },
  },
}