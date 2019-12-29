const Express = require('express');
const Message = require('../models/message');
const Friend = require('../models/friend');
const User = require('../models/user');
const router = Express.Router();

// 获取历史记录
router.post('/add', async (req, res) => {
  const {selfId, friendId} = req.body;
  if (!selfId || !friendId) {
    global.logger.error('selfId / friendId can\'t find')
    res.json({
      errno: 1
    });
    return;
  }
  // const message = {
  //   errno: 0,
  //   data: {},
  //   total: 0,
  //   current: current
  // }
  try {
    const checkUser = await User.findOne({_id: selfId}).exec();

    if(checkUser.length === 0 ) {
      res.json({
        errno: 1,
        data: '登录异常，请重新登录'
      });
      return;
    }

    const checkFriend = await Friend.find({selfId, friendId}).exec();

    if(checkFriend.length !== 0) {
      res.json({
        errno: 1,
        data: '您已经添加过该好友，请勿重复添加'
      });
      return;
    }

    const friendMoal = {
      selfId,
      friendId,
    }

    const friend = new Friend(friendMoal);

    const friendResult = await friend.save();

    console.log(friendResult);

    res.json({
      data: 0
    })
  } catch(e) {
    console.log(e);
    res.json({
      data: []
    })
  }
});


module.exports = router;