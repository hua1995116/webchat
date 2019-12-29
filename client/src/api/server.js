import Axios from './axios';

const Service = {
  // 登录接口
  loginUser: data => Axios.post('/api/user/signin', data),
  // 注册接口
  RegisterUser: data => Axios.post('/api/user/signup', data),
  // 获取当前房间所有历史记录
  RoomHistoryAll: data => Axios.get('/api/message/history', {
    params: data
  }),
  // 机器人
  getRobotMessage: data => Axios.get('/api/message/robotapi', {
    params: data
  }),
  // 上传图片
  postUploadFile: data => Axios.post('/api/file/uploadimg', data, {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }),

  postUploadAvatar: data => Axios.post('/api/file/avatar', data, {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }),

  getUserInfo: data => Axios.get('/api/user/getInfo', {
    params: data
  }),

  postAddFriend: data => Axios.post('/api/friend/add', data),

  // 请求公告
  getNotice: () => Axios.get('https://s3.qiufengh.com/config/notice-config.js')
};

export default Service;

