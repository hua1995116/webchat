/*引入*/
const mongoose = require('mongoose');
const config = require('../config/config');
// 用于异步回调
mongoose.Promise = require('bluebird');
global.db = mongoose.connect(`mongodb://${config.db.servername}:${config.db.port}/${config.db.DATABASE}`);

module.exports = mongoose;