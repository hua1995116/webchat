const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
// 创建实例
const cos = new COS({
    SecretId: '',
    SecretKey: '',
});
// 分片上传


function upload (list, callback) {
    const promiselist = list.map((item) => {
        return uploadPromise(item);
      })
      Promise.all(promiselist).then((res) => {
        console.log(res);
        callback()
      }).catch(err => {
        console.log('处理失败');
        console.log(err);
      })
}

function uploadPromise(url) {
    const name = path.basename(url);
    const type = mime.getType(name);
    const stream = fs.createReadStream(url);
    const {size} = fs.statSync(url);
    return new Promise((resolve, reject) => {
        cos.putObject({
            Bucket: 'webchat-1251965041',
            Region: 'ap-beijing',
            Key: name,
            ContentType: type,
            Body: stream,
            ContentLength: size
            // FilePath: url
        }, function (err, data) {
            if(err) {
                reject(err);
                return;
            }
            if(data.statusCode === 200) {
                resolve('success');
            }   
            console.log(data);
            
        });
    })
  }

module.exports = upload;