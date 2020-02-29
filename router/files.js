const Express = require('express');
const multer = require('multer');
const path = require('path')
const fs = require('fs');
const User = require('../models/user');
const Message = require('../models/message');
const fileTool = require('fs-extra');
const {cmder, rmDirFiles} = require('../utils/cmd');
const qnUpload = require('../deploy/qiniu');
const router = Express.Router();

const mkdirsSync = function(dirname) {
  if (fs.existsSync(dirname)) {
      return true;
  }
  if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
  }
}

// 创建文件夹
const createFolder = function (folder) {
  try {
      // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
      // 如果文件路径不存在将会抛出错误"no such file or directory"
      fs.accessSync(folder);
  } catch (e) {
      // 文件夹不存在，以同步的方式创建文件目录。
      mkdirsSync(folder);
  }
};

const uploadFolder = './static_temp';
const urlPath = './static/files';

console.log(uploadFolder);

createFolder(uploadFolder);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      // 接收到文件后输出的保存路径（若不存在则需要创建）
      cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
      // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
      cb(null, Date.now() + "-" + file.originalname);
  }
});

const storageAvatar = multer.diskStorage({
  destination: function (req, file, cb) {
      // 接收到文件后输出的保存路径（若不存在则需要创建）
      cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
      // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
      cb(null, ~~(Math.random() * 999999) +  "avatar-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype.toLowerCase();
  if(fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg' || fileType === 'image/webp') {
      cb(null, true)
  } else {
      cb(null, false)
  }
}
// 创建 multer 对象
const upload = multer({
  storage: storage,
  limits: {
      fields: 10,
      files: 10,
      fileSize: 5 * 1024 * 1024
  },
  fileFilter,
});

const uploadAvatar = multer({
  storage: storageAvatar,
  limits: {
      fields: 10,
      files: 10,
      fileSize: 4 * 1024 * 1024
  },
  fileFilter,
});

router.post('/uploadimg', upload.single('file'),  async (req, res, next) => {
  const file = req.file;
  if(file) {

      const {mimetype, filename, size, path: localPath} = file;

      const staticUrl = path.join('./static_temp', filename);
      let img = '';
      if(process.env.NODE_ENV === 'production') {
        await qnUpload([staticUrl]);
        // 因为是服务器运行可以直接写脚本
        await cmder(`rm -rf ./static_temp/* `);
        img =`//s3.qiufengh.com/webchat/` + filename;
      } else {
        // 兼容windows
        fileTool.copySync('./static_temp', './dist/static/files');
        rmDirFiles('./static_temp');
        img = path.join(urlPath, filename);
      }
      res.json({
        errno: 0,
        data: img,
        msg: '保存成功!'
      });
      return;
  } else {
      res.json({
          errno: 500,
          msg: '上传失败!'
      });
  }

});

router.post('/avatar', uploadAvatar.single('file'),  async (req, res, next) => {
  const file = req.file;
  if(file) {
      const {mimetype, filename, size, path: localPath} = file;
      const {username} = req.body;

      const staticUrl = path.join('./static_temp', filename);

      let img = '';
      if(process.env.NODE_ENV === 'production') {
        await qnUpload([staticUrl]);
        // 因为是服务器运行可以直接写脚本
        await cmder(`rm -rf ./static_temp/* `);
        img =`//s3.qiufengh.com/webchat/` + filename;
      } else {
        // 兼容windows
        fileTool.copySync('./static_temp', './dist/static/files');
        rmDirFiles('./static_temp');
        img = path.join(urlPath, filename);
      }
      console.log(img);

      User.update({name: username}, {src: img}, (err, data) => {
        if (err) {
          global.logger.error(err);
          res.json({
            errno: 500,
            msg: '保存异常!'
          });
          return;

        }
        res.json({
          errno: 0,
          data: {
            url: img
          },
          msg: '保存成功!'
        });
      })

  } else {
      res.json({
          errno: 500,
          msg: '保存异常!'
      });
  }

});

module.exports = router;