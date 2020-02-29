const Express = require('express');
const superagent = require('superagent');
const Friend = require('../models/friend');
const Message = require('../models/message');
const router = Express.Router();

function sort(a, b) {
  return a > b ? `${a}-${b}` : `${b}-${a}`; // 大的放前面
}

// 获取用户
router.get('/history/byUser', async (req, res) => {
  const { selfId } = req.query;
  if (!selfId) {
    global.logger.error('selfId current can\'t find')
    res.json({
      errno: 1
    });
    return;
  }
  try {
    // 待考虑，这一部分是否由客户端输入
    const checkFriend = await Friend.find({selfId}).populate({
      path: 'friendId',
      select: 'name src socketId'
    }).exec();

    const selfRoom = checkFriend.map(item => {
      return sort(item.selfId, item.friendId._id);
    });

    const allRooms = selfRoom.concat(['room1', 'room2']);

    const allMsg = allRooms.map(item => {
      return  Message.find( { roomid: item } ).sort({"_id": -1}).limit(20);
    })

    const results = await Promise.all(allMsg);

    const msgs = allRooms.reduce((obj, item, index) => {
      obj[item] = (results[index] || []).reverse();
      return obj;
    }, {})

    res.json({
      errno: 0,
      data: msgs
    })
  } catch(e) {
    console.log(e);
    res.json({
      errno: 1,
      msg: '错误'
    })
  }

})

router.get('/v2/history', async (req, res) => {
  const { roomid, msgid } = req.query;
  if (!roomid) {
    global.logger.error('roomid | msgid current can\'t find')
    res.json({
      errno: 1
    });
    return;
  }
  if(roomid.includes('-')) {
    // 单人房间
    const users = roomid.split('-');
    if(!req.user) {
      res.json({
        errno: 1,
        msg: '你暂无权限'
      })
      return;
    }
    if(!users.includes(req.user.id)) {
      res.json({
        errno: 1,
        msg: '你暂无权限'
      });
      return;
    }
  }
  try {
    const message = {};
    console.log(typeof msgid);
    if(!msgid) {
      const messageData = await Message.find( { roomid }).sort({"_id": -1}).limit(20).exec();
      message.data = messageData.reverse();
    } else {
      const messageData = await Message.find({'_id': { '$lt': msgid }, roomid }).sort({"_id": -1}).limit(20).exec();
      message.data = messageData.reverse();
    }

    res.json({
      errno: 0,
      data: message
    })
  } catch(e) {
    console.log(e);
    res.json({
      errno: 1,
      data: {}
    })
  }
})

// 获取历史记录
router.get('/history', async (req, res) => {
  const id = req.query.roomid;
  const current = req.query.current;
  const total = req.query.total || 0;
  if (!id || !current) {
    global.logger.error('roomid | page current can\'t find')
    res.json({
      errno: 1
    });
    return;
  }
  const message = {
    errno: 0,
    data: {},
    total: 0,
    current: current
  }
  try {
    const messageTotal = await Message.find({roomid: id}).count().exec();
    message.total = messageTotal;
    let skip = parseInt((current - 1) * 20);
    if(+total) {
      skip += (messageTotal - total);
    }
    const messageData = await Message.find({roomid: id}).skip(skip).sort({"time": -1}).limit(20).exec();
    message.data = messageData.reverse();
    res.json({
      data: message
    })
  } catch(e) {
    res.json({
      data: message
    })
  }
}),
// 机器人消息
router.get('/robotapi', (req, res) => {
  const response = res
  const info = req.query.info
  const userid = req.query.id
  const key = 'fde7f8d0b3c9471cbf787ea0fb0ca043'
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

router.get("/getHot", async (req, res) => {
  const result = await Message.aggregate([
    { $match: {} },
    {
      $group: {
        _id: "$username",
        count: { $sum: 1 }
      }
    },
    {
      $sort: {
        count: -1
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: "_id",
        foreignField: "name",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $limit : 10
    },
    {
      $project: {
        _id: 1,
        count: 1,
        'user._id': 1,
        'user.name': 1,
        'user.src': 1
      }
    },
  ]);

  res.json({
    errno: 0,
    data: result
  });
});


module.exports = router;