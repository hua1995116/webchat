import Vue from 'vue';
import Vuex from 'vuex';
import { userInfo } from './userInfo';
import { roomInfo } from './roomInfo';
import { friendInfo } from './friendInfo';
import { userDetail } from './userDetail';
import { group } from './group';
import { global } from './global';
import { search } from './search';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    userInfo,
    roomInfo,
    friendInfo,
    userDetail,
    group,
    global,
    search
  },
})

export default store;