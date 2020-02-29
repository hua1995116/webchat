var mongoose = require('mongoose')
//聊天记录模型
var MessageSchema = new mongoose.Schema({
  username: String,
  src: String,
  msg: {
    type: String,
    default: ''
  },
  roomid: String,
  clientId: String,
  roomType: String, // group single
  img: {
    type: String,
    default: ''
  },
  type: {
    type: String,
  },
  time: {
    type: Date,
    default: Date.now()
  }
})
//静态方法
MessageSchema.statics = {
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
module.exports = MessageSchema