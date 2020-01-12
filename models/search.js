var mongoose = require('mongoose')
var SearchSchema = require('../schemas/search')
var Search = mongoose.model('Search', SearchSchema)

module.exports = Search;