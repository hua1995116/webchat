const models = require("../models/index");

const GroupInfo = models["groupInfo"];
const GroupUser = models["groupUser"];

class GroupService {
  constructor() {}
  async create({ name, avatar, note, roomType, }) {
    const group = new GroupInfo({
      name,
      avatar,
      note,
      roomType,
    });
    return await group.save();
  }
  async join({ groupId, userId, friendId, lastMsgId }) {
    const result = await GroupUser.findOne({
      groupId,
      userId
    }).exec();
    if (result) {
      console.log(result);
      return null;
    }
    const group = new GroupUser({
      groupId,
      userId,
      friendId,
      lastMsgId,
    });
    return await group.save();
  }
  async list({ userId }) {
    const result = await GroupUser.find({
      userId,
    })
      .select('_id groupId userId friendId')
      .sort({ _id: -1 })
      .limit(100)
      .populate('groupInfo', 'name avatar roomType')
      .populate('friendInfo', 'username avatar')
      .exec();
    return result;
  }
  async userList({ groupId }) {
    const result = await GroupUser.find({
      groupId,
    })
      .select('_id groupId userId')
      .limit(100)
      .populate('userInfo', 'username avatar')
      .exec();
    return result;
  }
}

module.exports = GroupService;
