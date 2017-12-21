/*引入*/
var mongoose = require('mongoose')
// 用于异步回调
mongoose.Promise = require('bluebird')
global.db = mongoose.connect("mongodb://localhost:27017/vuechat")

module.exports = mongoose;