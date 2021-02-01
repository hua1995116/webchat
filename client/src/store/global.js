import { setItem, getItem } from '@utils/localStorage';
import url from '@api/server.js';

export const global = {
  state: {
    isDiscount: false,
  },
  mutations: {
    setDiscount(state, value) {
      state.isDiscount = value;
    },
  },
  actions: {
    async uploadImg({}, data) {
      try {
        const res = await url.postUploadFile(data);
        return {
          data: res,
          code: 0,
        }
      } catch(e) {
        return {
          data: '服务端异常,重新发送',
          code: 500,
        }
      }
    },
  },
}