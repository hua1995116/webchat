import Axios from './axios'

const Service = {
  // 登录接口
  loginUser: data => Axios.post('/user/signin', data),
  // 注册接口
  RegisterUser: data => Axios.post('/user/signup', data),
  // 获取当前房间历史记录
  RoomHistory: data => Axios.get('/message', {params: data}),
  // 获取当前房间所有历史记录
  RoomHistoryAll: data => Axios.get('/history/message', {
    params: data
  }),
  // 机器人
  getRobotMessage: data => Axios.get('/robotapi', {
    params: data
  }),
  // 上传图片
  postUploadFile: data => Axios.post('/file/uploadimg', data, {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}

export default Service

