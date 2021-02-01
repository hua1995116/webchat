const Express = require("express");
// const User = require('../models/user');
const models = require("../models/index");
const router = Express.Router();
var jwtConfig = require("../config/jwt");
var jwt = require("jwt-simple");

const User = models["user"];

// 注册
router.post("/signup", async (req, res) => {
  const { username, password, avatar } = req.body;
  if (username.length > 15) {
    res.json({
      errno: 1,
      msg: "用户名过长",
      data: {},
    });
    return;
  }
  if (password.length > 20) {
    res.json({
      errno: 1,
      msg: "密码过长",
      data: {},
    });
    return;
  }
  try {
    const userResult = await User.findOne({ username }).exec();
    if (userResult) {
      res.json({
        errno: 1,
        msg: "用户名已存在",
        data: {},
      });
      return;
    }

    const user = new User({
      username,
      password,
      avatar,
    });

    const result = await user.save();

    const userInfo = {
      username: username,
      avatar: result.avatar,
      userId: result.id,
    };
    res.json({
      errno: 0,
      data: {
        userInfo,
        token: jwt.encode(userInfo, jwtConfig.secret),
      },
      msg: "注册成功",
    });
  } catch (e) {
    console.log(e);
    res.json({
      errno: 1,
      msg: "注册异常",
      data: {},
    });
  }
});
// 登录
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userResult = await User.findOne({ username }).exec();
    if (!userResult) {
      res.json({
        errno: 1,
        msg: "用户不存在",
        data: {},
      });
      return;
    }
    if (!!password) {
      const isMatch = await userResult.comparePassword(password);
      if (isMatch) {
        const userInfo = {
          username: username,
          avatar: userResult.avatar,
          userId: userResult.id,
        };
        res.json({
          errno: 0,
          msg: "登录成功",
          data: {
            userInfo,
            token: jwt.encode(userInfo, jwtConfig.secret),
          },
        });
      } else {
        res.json({
          errno: 1,
          msg: "密码不正确",
          data: {},
        });
        return;
      }
    } else {
      res.json({
        errno: 1,
        msg: "登录失败",
        data: {},
      });
    }
  } catch (e) {
    console.log(e);
    res.json({
      errno: 1,
      msg: "异常错误",
      data: {},
    });
  }
});

router.get("/getInfo", async (req, res) => {
  const { username } = req.query;
  if (!username) {
    global.logger.error("username can't find");
    res.json({
      errno: 1,
      msg: "username can't find",
    });
    return;
  }
  const userResult = await User.findOne({ username }).select('_id avatar username').exec();

  res.json({
    errno: 0,
    data: userResult,
  });
});

router.get("/vipuser", async (req, res) => {
  const userResult = await User.find(
    { name: "hua1995116" },
    "_id name src"
  ).exec();
  res.json({
    errno: 0,
    data: userResult,
  });
});

router.get("/search", async (req, res) => {
  const { name } = req.query;
  if (!name) {
    global.logger.error("name can't find");
    res.json({
      errno: 0,
      data: [],
      // msg: 'name can\'t find'
    });
    return;
  }

  const result = await User.find(
    { name: new RegExp(name) },
    "_id name src"
  ).exec();

  res.json({
    errno: 0,
    data: result,
  });
});

module.exports = router;
