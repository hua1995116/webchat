const Express = require('express');
const superagent = require('superagent');
const Message = require('../models/message');
const router = Express.Router();

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