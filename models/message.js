var mongoose = require('mongoose')
var MessageSchema = require('../schemas/message')
var Message = mongoose.model('Message',MessageSchema)

module.exports = Message