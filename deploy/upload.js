const qiniu = require('qiniu');
const path = require('path');
const configStatic = require('./config');
const accessKey = configStatic.accessKey;
const secretKey = configStatic.secretKey;
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);


const options = {
  scope: 'webchat',
};

const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone[configStatic.zone];


const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();

// 文件上传

/**
 * 
 * 
 * @param {Array} list 
 */
function upload(list, callback) {
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
/**
 * 
 * 
 * @param {String} url 
 * @returns {Promise} 
 */
function uploadPromise(url) {
  const name = path.basename(url);
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, name, url, putExtra, function(respErr,
      respBody, respInfo) {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        resolve('success');
        // console.log(respBody);
      } else if(respInfo.statusCode == 614) {
        resolve('re_success');
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
        console.log('出错啦~');
        reject(respInfo.statusCode);
      }
    });
  })
}

module.exports = upload;
