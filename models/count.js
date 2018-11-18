var mongoose = require('mongoose')
var CountSchema = require('../schemas/count')
var Count = mongoose.model('Count', CountSchema)

module.exports = Count