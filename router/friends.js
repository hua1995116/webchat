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

    const friendReverseMoal = {
      selfId: friendId,
      friendId: selfId,
    }

    const friend = new Friend(friendMoal);
    const frinedReverse = new Friend(friendReverseMoal);

    const friendResult = await friend.save();

    const f2Result = await frinedReverse.save();

    console.log(friendResult, f2Result);

    res.json({
      data: '添加成功',
      errno: 0,
    })
  } catch(e) {
    console.log(e);
    res.json({
      errno: 1,
      data: '服务器异常'
    })
  }
});

router.post('/list', async (req, res) => {
  const {selfId} = req.body;
  if (!selfId) {
    global.logger.error('selfId can\'t find')
    res.json({
      errno: 1
    });
    return;
  }

  const checkFriend = await Friend.find({selfId}).populate({
    path: 'friendId',
    select: 'name src socketId'
  }).exec();
  console.log(checkFriend);

  res.json({
    errno: 0,
    data: checkFriend
  })
});


module.exports = router;