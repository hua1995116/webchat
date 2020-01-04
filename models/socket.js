var mongoose = require('mongoose')
var SocketSchema = require('../schemas/socket')
var Socket = mongoose.model('Socket', SocketSchema)

module.exports = Socket;