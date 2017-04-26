var mongoose = require('mongoose')
var UserSchema = require('../schemas/user')
var User = mongoose.model('User',UserSchema)

module.exports = User