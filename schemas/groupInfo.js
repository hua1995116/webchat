const mongoose = require('mongoose')
// 组
const GroupInfoSchema = new mongoose.Schema({
  name: String, // 组名
  avatar: String, // 头像
  note: String, // 公告/ 说明
  roomType: String, // 房间类型，单人还是多人 group single
  time: {
    type: Date,
    default: Date.now()
  }
})
//静态方法
GroupInfoSchema.statics = {
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
module.exports = GroupInfoSchema