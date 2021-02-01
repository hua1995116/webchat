const mongoose = require('mongoose')
// 聊天记录模型
const MessageSchema = new mongoose.Schema({
  msgType: { // 图片、文本、视频、语音、code、表情
    type: String,
    default: ''
  },
  msg: {
    type: String,
    default: ''
  },
  groupId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  roomType: String, // group single
  clientId: String, // 用于确认是否发送成功
  time: {
    type: Date,
    default: Date.now()
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

MessageSchema.virtual('userInfo', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

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