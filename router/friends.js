const Express = require('express');
const Message = require('../models/message');
const Friend = require('../models/friend');
const User = require('../models/user');
const Socket = require('../models/socket');
const router = Express.Router();

// 添加好友
router.post('/add', async (req, res) => {
  const {selfId, friendId} = req.body;
  if (!selfId || !friendId) {
    global.logger.error('selfId / friendId can\'t find')
    res.json({
      errno: 1
    });
    return;
  }
  try {
    if(selfId === friendId) {
      res.json({
        error: 1,
        data: '咱不开玩笑，放过自己吧🤣'
      })
      return;
    }

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
    });
    const friendRes = await Friend.find({selfId: friendId}).populate({
      path: 'friendId',
      select: 'name src socketId'
    }).exec();
    const selfSockets = await Socket.find({ userId: friendId });
    selfSockets.forEach((socket) => {
      // 兼容多端设备
      // io.to(socket.socketId).emit('message', mess);
      global.socketIO.to(socket.socketId).emit('friend', friendRes);
    });

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