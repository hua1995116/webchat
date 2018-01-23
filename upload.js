var qiniu = require('qiniu');
var accessKey = '';
var secretKey = '';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);


var options = {
  scope: 'webchat',
};

var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);

var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z2;


var localFile = "fs.js";
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();

// 文件上传


function upload(list) {
  const promiselist = list.map((item) => {
    return uploadPromise(item);
  })
  Promise.all(promiselist).then((res) => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
}

function uploadPromise(url) {
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, url, url, putExtra, function(respErr,
      respBody, respInfo) {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        resolve('success');
        // console.log(respBody);
      } else {
        // console.log(respInfo.statusCode);
        // console.log(respBody);
        reject(respInfo.statusCode);
      }
    });
  })
}

module.exports = upload;
