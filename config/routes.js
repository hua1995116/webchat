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
      console.log(fields)
      var filesTmp = JSON.stringify(files, null, 2)
      console.log(filesTmp)
      if (err) {
        console.log('parse error: ' + err)
        res.json({
          errno: 1
        })
      } else {
        var inputFile = files.file[0];
        var uploadedPath = inputFile.path
        var array = inputFile.originalFilename.split('.')
        var imgtype = array[array.length - 1]
        var dstPath = './static/files/' + new Date().getTime() + '.' + imgtype
        //重命名为真实文件名
        fs.rename(uploadedPath, dstPath, function (err) {
          if (err) {
            console.log('rename error: ' + err)
            res.json({
              errno: 1
            })
          } else {
            var mess = {
              username: fields.username,
              src: fields.src,
              img: dstPath,
              roomid: fields.roomid
            }
            var message = new Message(mess)
            message.save(function (err, mess) {
              if (err) {
                console.log(err)
              }
              console.log(mess)
            })
            console.log('rename ok')
            res.json({
              errno: 0
            })
          }
        })
      }
    })

  })
  // 注册
  app.post('/user/signup', function (req, res) {
    var _user = req.body
    console.log(_user)
    User.findOne({name: _user.name}, function (err, user) {
      if (err) {
        console.log(err)
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
            console.log(err)
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
      console.log(req.body)
      var _user = req.body
      var name = _user.name
      var password = _user.password
      console.log(password)
      User.findOne({name: name}, function (err, user) {
        if (err) {
          console.log(err);
        }
        console.log(user)
        if (!user) {
          res.json({
            errno: 1,
            data: '用户不存在'
          })
        } else {
          if (!!password) {
            user.comparePassword(password, function (err, isMatch) {
              if (err) {
                console.log(err);
              }
              if (isMatch) {
                req.session.user = user;
                console.log('success');
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
                console.log('password is not meached');
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
      Message.find({roomid: id}).sort({"time": -1}).limit(5).exec(function (err, message) {
        if (err) {
          console.log(err)
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
      Message.find({roomid: id}).exec(function (err, messsage) {
        if (err) {
          console.log(err)
        } else {
          res.json({
            errno: 0,
            data: messsage
          })
        }
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
            console.log(err)
          }
          response.json({
            data: res.text
          })
        })
    })
}