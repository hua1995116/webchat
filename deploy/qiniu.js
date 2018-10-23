const qiniuNode= require('qiniu-node');
const config = require('./config');

module.exports = function(fileList) {
    const qiniu = new qiniuNode(config);
    return qiniu.upload(fileList);
}