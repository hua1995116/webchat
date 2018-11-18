var mongoose = require('mongoose')
//聊天记录模型
var CountSchema = new mongoose.Schema({
  username: String,
  roomInfo: String
})
//静态方法
CountSchema.statics = {
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
module.exports = CountSchema