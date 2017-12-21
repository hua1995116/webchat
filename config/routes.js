const User = require('../models/user')
const Message = require('../models/message')
const superagent = require('superagent')
const fs = require('fs')
const multiparty = require('multiparty');
module.exports =  (app) => {
  app.use( (req, res, next) => {
    const _user = req.session.user

    app.locals.user = _user

    next()
  })
  app.post('/file/uploadimg',  (req, res, next) => {
    // //生成multiparty对象，并配置上传目标路径
    const form = new multiparty.Form()
    // //设置编辑
    form.encoding = 'utf-8'
    // //设置文件存储路径
    form.uploadDir = "./static/files/"
    // //设置单文件大小限制
    form.maxFilesSize = 2 * 1024 * 1024
    // form.maxFields = 1000;  设置所以文件的大小总和
    // 上传完成后处理
    form.parse(req, (err, fields, files) => {
      if (err) {
        global.logger.error('parse error: ' + err)
        res.json({
          errno: 1
        })
      } else {
        const inputFile = files.file[0];
        const uploadedPath = inputFile.path
        const array = inputFile.originalFilename.split('.')
        const imgtype = array[array.length - 1]
        let dstPath;
        const time = new Date().getTime();
        if (process.env.NODE_ENV === 'development') {
          dstPath = `./static/files/${time}.${imgtype}`
        } else {
          dstPath = `./dist/static/files/${time}.${imgtype}`
        }
        const inPath = `./static/files/${time}.${imgtype}`
        // 判断是否存在./dist/static/files文件
        fs.stat('./dist/static/files', (err, stats) => {
          if (JSON.stringify(stats) === undefined) {
            fs.mkdirSync('./dist', 0777)
            fs.mkdirSync('./dist/static', 0777)
            fs.mkdirSync('./dist/static/files', 0777)
          }
          storeFiles(uploadedPath, dstPath, fields, inPath)
        })
      }
    })
    function storeFiles(uploadedPath, dstPath, fields, inPath) {
      //重命名为真实文件名
      fs.rename(uploadedPath, dstPath,  (err) => {
        if (err) {
          global.logger.error(`rename error:${err}`)
          res.json({
            errno: 1
          })
        } else {
          const mess = {
            username: fields.username,
            src: fields.src,
            img: inPath,
            roomid: fields.roomid,
            time: fields.time
          }
          const message = new Message(mess)
          message.save((err, mess) => {
            if (err) {
              global.logger.error(err)
            }
            global.logger.info(mess)
          })
          global.logger.info('rename ok')
          res.json({
            errno: 0
          })
        }
      })
    }
  })
  // 注册
  app.post('/user/signup',  (req, res) => {
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
  app.post('/user/signin', (req, res) => {
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

  // 信息
  app.get('/message', (req, res) => {
    const id = req.query.roomid
    Message.find({roomid: id}).sort({"time": -1}).limit(80).exec((err, message) => {
      if (err) {
        global.logger.error(err)
      } else {
        res.json({
          errno: 0,
          data: message.reverse()
        })
      }
    })
  }),
  // 获取历史记录
  app.get('/history/message', (req, res) => {
    const id = req.query.roomid
    const current = req.query.current
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
    const task1 = new Promise((resolve, reject) => {
      const skip = parseInt((current - 1) * 40)
      Message.find({roomid: id}).skip(skip).limit(40).exec((err, data) => {
        if (err) {
          global.logger.error(err)
          return reject()
        } else {
          message.data = data
          return resolve()
        }
      })
    })
    const task2 = new Promise((resolve, reject) => {
      Message.find({roomid: id}).count().exec((err, data) => {
        if (err) {
          global.logger.error(err)
          return reject()
        } else {
          message.total = data
          return resolve()
        }
      })
    })
    Promise.all([task1, task2]).then(() => {
      res.json({
        data: message
      })
    })
  }),
  // 机器人消息
  app.get('/robotapi', (req, res) => {
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
