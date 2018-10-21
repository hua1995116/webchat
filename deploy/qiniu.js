const qiniuNode= require('qiniu-node');
const config = require('./config');
const qiniu = new qiniuNode(config);

module.exports = function(fileList) {
    return qiniu.upload(fileList);
}