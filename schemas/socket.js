var mongoose = require('mongoose')
// socket模型
// 如果 os 和 browser 一致时，则更新数据，否则新建数据。
var SocketSchema = new mongoose.Schema({
  socketId: {
    type: String,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ip: String,
  os: {    // 设备
    type: String,
    default: ''
  },
  browser: {  // 浏览器
    type: String,
    default: ''
  },
  ua: {   // 完整 ua
    type: String,
    default: ''
  },
  time: {
    type: Date,
    default: Date.now()
  }
})
//静态方法
SocketSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort('time')
      .exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}
module.exports = SocketSchema