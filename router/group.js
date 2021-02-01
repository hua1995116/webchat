const Express = require("express");
const models = require("../models/index");
const GroupService = require('../services/group');
const groupService = new GroupService();
const router = Express.Router();
const GroupInfo = models['groupInfo'];


router.post('/create', async (req, res) => {
  const { name, avatar, note, roomType } = req.body;
  try {
    const infoResult = await groupService.create({
      name,
      avatar,
      note,
      roomType
    });
    res.success({
      msg: '创建成功',
      data: {
        id: infoResult.id
      }
    })

  } catch (e) {
    console.error(e);
    res.error({
      msg: '创建失败'
    })
  }
});

router.post('/addGroup', async (req, res) => {
  const { userId, groupId } = req.body;
  if (!groupId || !userId) {
    res.error({
      msg: 'groupId and userId can\'t find'
    });
    return;
  }
  try {
    const groupResult = await groupService.join({
      userId,
      groupId
    })
    if (!groupResult) {
      res.error({
        msg: '重复加入'
      });
      return;
    }
    res.success({
      msg: '加入成功',
      data: {}
    })
  } catch (e) {
    console.log(e);
    res.error({
      msg: '加入失败'
    })
  }
});


router.get('/list', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    res.error({
      msg: 'userId can\'t find'
    });
    return;
  }
  try {
    const groupResult = await groupService.list({ userId });
    const formatResult = groupResult.map(item => {
      global.logger.info(item.groupInfo, item.friendInfo);
      return {
        id: item.id,
        friendId: item.friendId,
        avatar: item.groupInfo.roomType === 'group' ? item.groupInfo.avatar : item.friendInfo.avatar,
        name: item.groupInfo.roomType === 'group' ? item.groupInfo.name : item.friendInfo.username,
        groupId: item.groupId,
        roomType: item.groupInfo.roomType,
        userId: item.userId
      }
    })
    res.success({
      data: formatResult,
      msg: '获取成功',
    })
  } catch (e) {
    global.logger.error(e);
    res.error({
      msg: '列表获取失败',
      data: []
    })
  }

})

router.get('/userList', async (req, res) => {
  const { groupId } = req.query;
  if (!groupId) {
    res.error({
      msg: 'groupId can\'t find'
    });
    return;
  }
  try {
    const groupResult = await groupService.userList({ groupId });
    res.success({
      data: groupResult,
      msg: '获取成功',
    })
  } catch (e) {
    global.logger.error(e);
    res.error({
      msg: '列表获取失败',
      data: []
    })
  }
})

module.exports = router;