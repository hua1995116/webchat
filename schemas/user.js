const mongoose = require('mongoose')
//用于md5加密
const bcrypt = require('bcryptjs')
//加盐数
const SALT_WORK_FACTOR = 10
const UserSchema = new mongoose.Schema({
  username:{ // 用户名字
    type: String,
    max: 20
  },
  nickname: { // 用户名字
    type: String,
    max: 20
  }, // 昵称
  sex: { // 性别 0-男  1-女
    type: Number,
    max: 1
  },
  iphone: {     // 电话号
    type: String,
    max: 20,
  },
  email: { // 邮箱
    type: String,
    max: 30,
  },
  password: String,  // 密码
  avatar: String, // 头像
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});
//对密码进行加密
UserSchema.pre('save', function (next) {
  const user = this
  if (this.isNew) {
    this.createAt = this.updateAt = Date.now()
  }
  else {
    this.updateAt = Date.now()
  }
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })
})
//用于比较密码是否正确
UserSchema.methods = {
  comparePassword: function (_password) {
    const db = this;
    return new Promise(function (rev, rej) {
      console.log(_password, db.password, '==password');
      bcrypt.compare(_password, db.password, function (err, isMatch) {
        if (err) return rej(err)
        rev(isMatch)
      })
    })
  }
}

UserSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = UserSchema