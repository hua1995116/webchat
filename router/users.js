const Express = require('express');
const User = require('../models/user');
const router = Express.Router();
var jwtConfig = require('../config/jwt');
var jwt = require('jwt-simple');

// 注册
router.post('/signup',  (req, res) => {
  const { name, password, src } = req.body;
  if(name.length > 15) {
    res.json({
      errno: 1,
      data: '用户名过长'
    });
    return;
  }
  if(password.length > 20) {
    res.json({
      errno: 1,
      data: '密码过长'
    });
    return;
  }
  User.findOne({name},  (err, user) => {
    if (err) {
      global.logger.error(err)
    }
    if (user) {
      res.json({
        errno: 1,
        data: '用户名已存在'
      })
    } else {
      user = new User({
        name,
        password,
        src
      })
      user.save( (err, user) => {
        if (err) {
          global.logger.error(err)
        }
        const userInfo = {
          name: name,
          src: user.src,
          id: user.id,
        }
        res.json({
          errno: 0,
          userInfo,
          token: jwt.encode(userInfo, jwtConfig.secret),
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
            global.logger.info('success');
            const userInfo = {
              name: name,
              src: user.src,
              id: user.id,
            }
            res.json({
              errno: 0,
              data: '登录成功',
              userInfo,
              token: jwt.encode(userInfo, jwtConfig.secret),
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
  const { id } = req.query;
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

router.get('/vipuser', async (req, res) => {
  const userResult = await User.find({name: 'hua1995116'}, '_id name src').exec();
  res.json({
    errno: 0,
    data: userResult
  })
})

router.get('/search', async (req, res) => {
  const { name } = req.query;
  if(!name) {
    global.logger.error('name can\'t find')
    res.json({
      errno: 0,
      data: []
      // msg: 'name can\'t find'
    });
    return;
  }

  const result = await User.find({name: new RegExp(name)}, '_id name src').exec();

  res.json({
    errno: 0,
    data: result
  })
})

module.exports = router;