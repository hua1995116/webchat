import url from '@api/server.js';

export const group = {
  state: {
    groupList: [],
  },
  mutations: {
    setGroupList(state, data) {
      state.groupList = data;
    },
  },
  actions: {
    async getGroupList({state, commit}, data) {
      const res = await url.getGroupList(data);
      commit('setGroupList', res);
    },
  },
}