const mongoose = require('mongoose')
// 组
const GroupUserSchema = new mongoose.Schema({
  groupId: mongoose.Schema.Types.ObjectId, // groupInfo id
  userId: mongoose.Schema.Types.ObjectId,
  friendId: mongoose.Schema.Types.ObjectId,
  lastMsgId: mongoose.Schema.Types.ObjectId,
  isDelete: {
    type: Boolean,
    default: false
  },
  time: {
    type: Date,
    default: Date.now()
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

GroupUserSchema.virtual('groupInfo', {
  ref: 'GroupInfo',
  localField: 'groupId',
  foreignField: '_id',
  justOne: true
});

GroupUserSchema.virtual('friendInfo', {
  ref: 'User',
  localField: 'friendId',
  foreignField: '_id',
  justOne: true
});

GroupUserSchema.virtual('userInfo', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

//静态方法
GroupUserSchema.statics = {
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
module.exports = GroupUserSchema