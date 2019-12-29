var mongoose = require('mongoose')
var FriendSchema = require('../schemas/friend')
var Friend = mongoose.model('Friend', FriendSchema)

module.exports = Friend;