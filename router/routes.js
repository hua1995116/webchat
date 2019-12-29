const User = require('../models/user')
const Message = require('../models/message')
const superagent = require('superagent')
// const path = require('path')
// const fs = require('fs')
// const multer = require('multer');
const qnUpload = require('../deploy/qiniu');
// const {cmder, rmDirFiles} = require('../utils/cmd');
// const fileTool = require('fs-extra');

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

module.exports = (app) => {
  app.use( (req, res, next) => {
    const _user = req.session.user

    app.locals.user = _user

    next()
  })

  /* POST upload listing. */
  app.post('/api/file/uploadimg', upload.single('file'),  async (req, res, next) => {
    const file = req.file;
    if(file) {

        const {mimetype, filename, size, path: localPath} = file;

        const {username, roomid, time, src} = req.body;

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

        const mess = {
          username,
          src,
          img,
          roomid,
          time,
        }

        const message = new Message(mess);
        message.save((err, mess) => {
          if (err) {
            global.logger.error(err);
            res.json({
              errno: 500,
              msg: '保存异常!'
            });
            return;
          }
          global.logger.info(mess);
          res.json({
            errno: 200,
            msg: '保存成功!'
          });
        })
        return;
    } else {
        res.json({
            errno: 500,
            msg: '保存异常!'
        });
    }

  });

  app.post('/api/file/avatar', uploadAvatar.single('file'),  async (req, res, next) => {
    const file = req.file;
    console.log(req.body);
    console.log(file);
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

  // 注册
  app.post('/api/user/signup',  (req, res) => {
    const _user = req.body
    // console.log(_user)
    User.findOne({name: _user.name},  (err, user) => {
      if (err) {
        global.logger.error(err)
      }
      if (user) {
        res.json({
          errno: 1,
          data: '用户名已存在'
        })
      } else {
        user = new User(_user)
        user.save( (err, user) => {
          if (err) {
            global.logger.error(err)
          }
          res.json({
            errno: 0,
            data: '注册成功'
          })
        })
      }
    })
  }),
  // 登录
  app.post('/api/user/signin', (req, res) => {
    const _user = req.body
    const name = _user.name
    const password = _user.password
    User.findOne({name: name}, (err, user) => {
      if (err) {
        global.logger.error(err);
      }
      if (!user) {
        res.json({
          errno: 1,
          data: '用户不存在'
        })
      } else {
        if (!!password) {
          user.comparePassword(password, (err, isMatch) => {
            if (err) {
              global.logger.error(err);
            }
            if (isMatch) {
              req.session.user = user;
              global.logger.info('success');
              res.json({
                errno: 0,
                data: '登录成功',
                name: name,
                src: user.src
              })
            } else {
              res.json({
                errno: 1,
                data: '密码不正确'
              })
              global.logger.info('password is not meached');
            }
          })
        } else {
          res.json({
            errno: 1,
            data: '登录失败'
          })
        }
      }

    })
  }),
  // 获取历史记录
  app.get('/api/history/message', async (req, res) => {
    const id = req.query.roomid;
    const current = req.query.current;
    const total = req.query.total || 0;
    if (!id || !current) {
      global.logger.error('roomid | page current can\'t find')
      res.json({
        errno: 1
      });
    }
    const message = {
      errno: 0,
      data: {},
      total: 0,
      current: current
    }
    try {
      const messageTotal = await Message.find({roomid: id}).count().exec();
      message.total = messageTotal;
      let skip = parseInt((current - 1) * 20);
      if(+total) {
        skip += (messageTotal - total);
      }
      const messageData = await Message.find({roomid: id}).skip(skip).sort({"time": -1}).limit(20).exec();
      message.data = messageData.reverse();
      res.json({
        data: message
      })
    } catch(e) {
      res.json({
        data: message
      })
    }
  }),
  // 机器人消息
  app.get('/api/robotapi', (req, res) => {
    const response = res
    const info = req.query.info
    const userid = req.query.id
    const key = 'fde7f8d0b3c9471cbf787ea0fb0ca043'
    superagent.post('http://www.tuling123.com/openapi/api')
      .send({info, userid, key})
      .end((err, res) => {
        if (err) {
          global.logger.error(err)
        }
        response.json({
          data: res.text
        })
      })
  })
}
