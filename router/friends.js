const Express = require('express');
const Message = require('../models/message');
// const Friend = require('../models/friend');
const User = require('../models/user');
const Socket = require('../models/socket');
const GroupService = require('../services/group');
const groupService = new GroupService();
const router = Express.Router();
const models = require("../models/index");

const GroupUser = models['groupUser'];
const Friend = models['friend'];

// 添加好友
router.post('/add', async (req, res) => {
  const { selfId, friendId } = req.body;
  console.log(selfId, friendId, '===');
  if (!selfId || !friendId) {
    res.error({
      msg: `selfId / friendId can\'t find`
    });
    return;
  }
  try {
    if(selfId === friendId) {
      res.error({
        msg: '咱不开玩笑，放过自己吧🤣'
      })
      return;
    }

    const checkUser = await User.findOne({_id: selfId}).exec();

    if(checkUser.length === 0 ) {
      res.error({
        msg: '登录异常，请重新登录'
      });
      return;
    }

    const checkFriend = await Friend.find({selfId, friendId}).exec();

    if(checkFriend.length !== 0) {
      res.error({
        msg: '您已经添加过该好友，请勿重复添加'
      });
      return;
    }

    const friendMoal = {
      selfId,
      friendId,
      roomType: 'single'
    }

    const friendReverseMoal = {
      selfId: friendId,
      friendId: selfId,
      roomType: 'single'
    }
    // 添加好友
    const friend = new Friend(friendMoal);
    const frinedReverse = new Friend(friendReverseMoal);

    const friendResult = await friend.save();

    const f2Result = await frinedReverse.save();

    // 创建好友组
    const infoResult = await groupService.create({
      name: '',
      avatar: '',
      note: '',
      roomType: 'single'
    });

    const selfGroupResult = await groupService.join({
      userId: selfId,
      friendId: friendId,
      groupId: infoResult.id,
    })

    const friendGroupResult = await groupService.join({
      userId: friendId,
      friendId: selfId,
      groupId: infoResult.id,
    })
    // console.log(friendResult, f2Result);

    res.success({
      msg: '添加成功',
      data: '',
    });
    const friendRes = await GroupUser.find({selfId: friendId}).populate({
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
    res.error({
      msg: '服务器异常'
    })
  }
});

// router.post('/list', async (req, res) => {
//   const { selfId } = req.body;
//   if (!selfId) {
//     global.logger.error('selfId can\'t find')
//     res.json({
//       errno: 1,
//       msg: "selfId can\'t find"
//     });
//     return;
//   }

//   const checkFriend = await Friend.find({selfId}).populate({
//     path: 'friendId',
//     select: 'username avatar'
//   }).exec();
//   console.log(checkFriend);

//   res.json({
//     errno: 0,
//     msg: "成功",
//     data: checkFriend
//   })
// });


module.exports = router;