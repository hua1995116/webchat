import { setItem, getItem } from '@utils/localStorage';
import url from '@api/server.js';

export const search = {
  state: {
    hotUserList: [],
    vipUserList: [],
    searchUserList: [],
  },
  mutations: {
    sethotUserList(state, data) {
      state.hotUserList = data;
    },
    setvipUserList(state, data) {
      state.vipUserList = data;
    },
    setSearchList(state, data) {
      state.searchUserList = data;
    },
  },
  actions: {
    async getSearch({state, commit}, data) {
      const res = await url.getSearch(data);
      if(res.data.errno === 0) {
        commit('setSearchList', res.data.data)
      }
    },
    async getvipuser({state, commit}, data) {
      const res = await url.getvipuser(data);
      if(res.data.errno === 0) {
        commit('setvipUserList', res.data.data)
      }
    },
    async getHostUserList({state, commit}, data) {
      const res = await url.getHostUserList(data);
      if(res.data.errno === 0) {
        commit('sethotUserList', res.data.data)
      }
    },
  },
}