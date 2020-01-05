var mongoose = require('mongoose')
// socket模型
// 如果 os 和 browser 一致时，则更新数据，否则新建数据。
var SearchSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  ip: String,
  keyword: {
    type: String,
    max: 30
  },
  time: {
    type: Date,
    default: Date.now()
  }
})
//静态方法
SearchSchema.statics = {
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
module.exports = SearchSchema