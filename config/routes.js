var User = require('../models/user')
var Message = require('../models/message')
var superagent = require('superagent')
var fs = require('fs')
var multiparty = require('multiparty');
var util = require('util')
module.exports = function (app) {
  app.use(function (req, res, next) {
    var _user = req.session.user

    app.locals.user = _user

    next()
  })
  app.post('/file/uploadimg', function (req, res, next) {
    // console.log(util.inspect(req.body, { showHidden: true, depth: null }))
    // console.log(util.inspect(req.header, { showHidden: true, depth: null }))
    // //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form()
    // //设置编辑
    form.encoding = 'utf-8'
    // //设置文件存储路径
    form.uploadDir = "./static/files/"
    // //设置单文件大小限制
    form.maxFilesSize = 2 * 1024 * 1024
    // form.maxFields = 1000;  设置所以文件的大小总和
    // 上传完成后处理
    form.parse(req, function (err, fields, files) {
      // console.log(fields)
      var filesTmp = JSON.stringify(files, null, 2)
      // console.log(filesTmp)
      if (err) {
        global.logger.error('parse error: ' + err)
        res.json({
          errno: 1
        })
      } else {
        var inputFile = files.file[0];
        var uploadedPath = inputFile.path
        var array = inputFile.originalFilename.split('.')
        var imgtype = array[array.length - 1]
        var dstPath;
        if (process.env.NODE_ENV === 'development') {
          dstPath = './static/files/' + new Date().getTime() + '.' + imgtype
        } else {
          dstPath = './dist/static/files/' + new Date().getTime() + '.' + imgtype
        }
        var inPath = './static/files/' + new Date().getTime() + '.' + imgtype
        // 判断是否存在./dist/static/files文件
        fs.stat('./dist/static/files', function(err, stats) {
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
      fs.rename(uploadedPath, dstPath, function (err) {
        if (err) {
          global.logger.error('rename error: ' + err)
          res.json({
            errno: 1
          })
        } else {
          var mess = {
            username: fields.username,
            src: fields.src,
            img: inPath,
            roomid: fields.roomid,
            time: fields.time
          }
          var message = new Message(mess)
          message.save(function (err, mess) {
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
  app.post('/user/signup', function (req, res) {
    var _user = req.body
    // console.log(_user)
    User.findOne({name: _user.name}, function (err, user) {
      if (err) {
        global.logger.error(err)
      }
      if (user) {
        res.json({
          errno: 1,
          data: '用户名已存在'
        })
      } else {
        var user = new User(_user)
        user.save(function (err, user) {
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
  app.post('/user/signin', function (req, res) {
    // console.log(req.body)
    var _user = req.body
    var name = _user.name
    var password = _user.password
    // console.log(password)
    User.findOne({name: name}, function (err, user) {
      if (err) {
        global.logger.error(err);
      }
      // console.log(user)
      if (!user) {
        res.json({
          errno: 1,
          data: '用户不存在'
        })
      } else {
        if (!!password) {
          user.comparePassword(password, function (err, isMatch) {
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
  app.get('/message', function (req, res) {
    var id = req.query.roomid
    Message.find({roomid: id}).sort({"time": -1}).limit(80).exec(function (err, message) {
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
  app.get('/history/message', function (req, res) {
    var id = req.query.roomid
    var current = req.query.current
    if (!id || !current) {
      global.logger.error('roomid | page current can\'t find')
      res.json({
        errno: 1
      });
    }
    var message = {
      errno: 0,
      data: {},
      total: 0,
      current: current
    }
    var task1 = new Promise(function(resolve, reject) {
      var skip = parseInt((current - 1) * 40)
      Message.find({roomid: id}).skip(skip).limit(40).exec(function (err, data) {
        if (err) {
          global.logger.error(err)
          return reject()
        } else {
          message.data = data
          return resolve()
        }
      })
    })
    var task2 = new Promise(function(resolve, reject) {
      Message.find({roomid: id}).count().exec(function (err, data) {
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
  app.get('/robotapi', function (req, res) {
    var response = res
    var info = req.query.info
    var userid = req.query.id
    var key = 'fde7f8d0b3c9471cbf787ea0fb0ca043'
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
