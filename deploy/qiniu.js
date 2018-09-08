const qiniuNode= require('qiniu-node');
const qiniu = new qiniuNode({
    accessKey: '',  
    secretKey: '',  // key
    zone: 'Zone_z2', 
    bucket: 'chat',   // bucket name
    dir: 'webchat/',     // 
    url: 'http://pdlu3e6ll.bkt.clouddn.com/',
})

module.exports = function(fileList, callback) {
    qiniu.upload(fileList).then((res) => {
        callback()
    }); // fileList is a list of local url
}