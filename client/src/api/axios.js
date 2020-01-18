import axios from 'axios';
import Toast from "@components/Toast";

const baseURL = '';


const instance = axios.create();

instance.defaults.timeout = 30000; // 所有接口30s超时

// 请求统一处理
instance.interceptors.request.use(async config => {
  if (config.url && config.url.charAt(0) === '/') {
    config.url = `${baseURL}${config.url}`;
  }

  return config;
}, error => Promise.reject(error));

// 对返回的内容做统一处理
instance.interceptors.response.use(response => {
  if (response.status === 200) {
    return response;
  }
  return Promise.reject(response);
}, error => {
  if (error) {
    console.log(error);
    Toast({
      content: '网络异常，请检查你的网络。',
      timeout: 2000,
      background: "#f44336"
    });
  } else {
    Toast({
      content: '未知错误。',
      timeout: 2000,
      background: "#f44336"
    });
  }
  return Promise.reject(error);
});

export default instance;
