import { setItem, getItem } from '@utils/localStorage';
import url from '@api/server.js';

export const userInfo = {
  state: {
    avatar: getItem('avatar'),
    userId: getItem('userId'),
    token: getItem('token'),
    username: getItem('username'),
  },
  mutations: {
    setUserInfo(state, data) {
      console.log(state);
      const {type, value} = data;
      // 如果是 key - value 形式，为单项设置
      if(value) {
        setItem(type, value);
        state[type] = value;
      } else {
        const info = Object.keys(data);
        // 清空所有
        if(info.length == 0) {
          Object.keys(state).map(item => {
            state[item] = '';
            setItem(item, '');
          });
        } else {
          // 多数据一次性设置
          info.map(item => {
            state[item] = data[item];
            setItem(item, data[item]);
          });
        }
      }
    },
  },
  actions: {
    async registerSubmit({ }, data) {
      try {
        const res = await url.RegisterUser(data);
        return {
          status: 'success',
          ...res
        };
      } catch (e) {
        return {
          status: 'fail',
        }
      }
    },
    async loginSubmit({ }, data) {
      try {
        const res = await url.loginUser(data);
        return {
          status: 'success',
          ...res
        };
      } catch (e) {
        console.log(e);
        return {
          status: 'fail',
        }
      }
    },
  },
}