var User = require('../models/user')
var Message = require('../models/message')
var superagent = require('superagent')
module.exports = function (app) {
  app.use(function (req, res, next) {
    var _user = req.session.user

    app.locals.user = _user

    next()
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

    User.findOne({name: name}, function (err, user) {
      if (err) {
        console.log(err);
      }
      if (!user) {
        res.json({
          errno: 1,
          data: '用户不存在'
        })
      }
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
    })
  }),
  // 信息
  app.get('/message',function (req, res) {
    Message.find({}, function (err, message) {
      if(err) {
        console.log(err)
      } else{
        res.json({
          errno: 0,
          data: message
        })
      }
    })
  }),
  // 机器人消息
  app.get('/robotapi',function (req, res) {
    var response = res
    var info = req.query.info
    var userid = req.query.id
    var key = 'fde7f8d0b3c9471cbf787ea0fb0ca043'
    superagent.post('http://www.tuling123.com/openapi/api')
      .send({info, userid, key})
      .end((err, res) => {
        if(err){
          console.log(err)
        }
        response.json({
          data: res.text
        })
      })
  })
}