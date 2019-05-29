const qiniuNode= require('qiniu-node');
const config = require('./config');
const fs = require('fs');
const path = require('path');

function readUploadFiles(dir) {
  const rootPath = path.join(__dirname, dir);
  const dirs = fs.readdirSync(rootPath);
  return dirs.reduce((all, file) => {
    const curPath = path.join(rootPath, file);
    const isDir = fs.statSync(curPath).isDirectory();
    const extname = path.extname(curPath);
    if(!isDir && extname !== '.map') {
      all.push(curPath);
    }
    return all;
  }, []);
}

function main() {
  const cssFiles = readUploadFiles('../dist/static/css');
  const JsFiles = readUploadFiles('../dist/static/js');
  const qiniuCss = new qiniuNode({
    ...config,
    dir: 'webchat/static/css/'
  });
  const qiniuJs = new qiniuNode({
    ...config,
    dir: 'webchat/static/js/'
  });
  qiniuCss.upload(cssFiles);
  qiniuJs.upload(JsFiles);
}

main();