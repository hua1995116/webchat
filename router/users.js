const Express = require('express');
const User = require('../models/user');
const router = Express.Router();

// 注册
router.post('/signup',  (req, res) => {
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
          name: name,
          src: user.src,
          id: user.id,
          data: '注册成功'
        })
      })
    }
  })
});
// 登录
router.post('/signin', (req, res) => {
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
              src: user.src,
              id: user.id
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
});

router.get('/getInfo', async (req, res) => {
  const id = req.query.id;
  if (!id) {
    global.logger.error('id can\'t find')
    res.json({
      errno: 1
    });
    return;
  }
  const userResult = await User.find({name: id}).exec();
  console.log(userResult);
  res.json({
    errno: 0,
    data: {
      id: userResult[0]._id,
      name: userResult[0].name,
      src: userResult[0].src
    }
  })
})

module.exports = router;