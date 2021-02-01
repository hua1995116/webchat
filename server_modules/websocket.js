const xssFilters = require('xss-filters');
const Message = require('../models/message');
const User = require('../models/user');
const Socket = require('../models/socket');
const SocketLive = require('./socketLive');
const cookieParser = require('cookie-parser');
let cache = {};

const onlineRoom = new SocketLive();

if(process.env.NODE_ENV === 'production') {
  cache = require('./RedisCache');
  global.logger.info('RedisCache!!!!');
} else {
  cache = require('./cache');
  global.logger.info('cache!!!!');
}

const {
  inrcCache,
  getCacheById,
  updateCache,
  deleteCacheById,
  resetCacheById,
  updatehCache,
  gethCacheById,
  gethAllCache
} = cache;

const roomList = ['room1', 'room2'];

function websocket(server) {
    const io = require('socket.io')(server);
    global.socketIO = io;
    const users = {};

    io.on('connection',  (socket) => {
      //监听用户发布聊天内容
      global.logger.info('socket connect!');
      socket.on('message', async (msgObj) => {
        // msgType、msg、groupId、userId、roomType
        // msgType 图片、文本、视频、语音、code、表情
        // img / text/ video/ audio/ code / emjio
        // roomType group / single
        global.logger.info('socket message!');
        //向所有客户端广播发布的消息
        // const {username, src, msg, img, roomid, roomType, time, type, to, from, clientId} = msgObj;
        const { msgType, msg, groupId, userId, roomType, toId, clientId } = msgObj;

        if(!msg && !msgType && !groupId) {
          return;
        }
        // 后端限制字符长度
        const msgLimit = msg.slice(0, 200);
        const mess = {
          msgType,
          msg: xssFilters.inHTMLData(msgLimit),
          groupId,
          userId,
          roomType,
          clientId,
        }
        global.logger.info(msgObj);

        global.logger.info(`${mess.userId} 对房 ${mess.groupId} 说: ${mess.msg}`);
        let msgRes = {};
        const message = new Message(mess);
        msgRes = await message.save();

        msgRes = {
          ...msgRes,
          ...msgObj
        }

        // 处理消息通知
        io.to(mess.groupId).emit('message', msgRes);
        // if(roomType === 'group') {
        // } else if (roomType === 'single') {
        //   const selfSockets = await Socket.find({ userId });
        //   selfSockets.forEach((socket) => {
        //     // 兼容多端设备
        //     global.logger.info('自己的id', socket.socketId);
        //     io.to(socket.socketId).emit('message', msgRes);
        //   });
        //   const friendSockets = await Socket.find({ userId: toId });
        //   friendSockets.forEach((socket) => {
        //     // 兼容多端设备
        //     global.logger.info('被通知的id', socket.socketId);
        //     io.to(socket.socketId).emit('message', msgRes);
        //   });
        // }
        // fn(msgRes);
      })
      // 建立连接
      socket.on('login',async (user) => {
        // 更新自己的 socketId
        const address = socket.handshake.headers['x-real-ip'] || socket.request.connection.remoteAddress;
        const ip = address.split(':').slice(-1).join('');
        const { browser, os, usernmae, userId, ua } = user;
        global.logger.info({ browser, os, usernmae, userId, ua }, '=loginInfo');
        if(!browser || !os || !usernmae || !userId || !ua) {
          return;
        }
        const socketRes = await Socket.findOne({ userId ,ip, browser, os }).exec();
        global.logger.info("socketRes", socketRes);
        if(!socketRes) {
          const socketCtx = {
            browser,
            os,
            userId,
            ua,
            socketId: socket.id,
            ip,
          }

          const addSocket = await new Socket(socketCtx).save();
          global.logger.info("addSocket", addSocket);
        } else {
          const updateRes = await Socket.update({_id: socketRes._id}, {socketId: socket.id}).exec();
          global.logger.info('updateRes');
        }
        global.logger.info('socket login!', user, socket.id, address, ip);
        if (!usernmae) {
          return;
        }
        socket.usernmae = usernmae;
      });
      // 加入房间
      socket.on('room', async (user) => {
        global.logger.info('socket add room!');
        // const {name, roomid} = user;
        const { roomId, userId } = user;

        if (!roomId || !userId) {
          return;
        }

        // if (!users[roomid]) {
        //   users[roomid] = {};
        // }
        // // 初始化user
        // users[roomid][name] = Object.assign({}, {
        //   socketid: socket.id
        // }, user);

        // 进行会话
        socket.join(roomId);

        onlineRoom.addOnlineUser(roomId, userId);

        // const onlineUsers = {};
        // for(let item in users[roomid]) {
        //   onlineUsers[item] = {};
        //   onlineUsers[item].src = users[roomid][item].src;
        // }

        const onlineUsers = Object.keys(onlineRoom.getOnlineUser(roomId));

        io.to(roomId).emit('room', { onlineUsers , roomId });
        global.logger.info(`${userId} 加入了 ${roomId}`);
      });

      socket.on('roomout', async (user) => {
        global.logger.info('socket loginout!');
        handleLogoutRoom(socket);
      })

      socket.on('disconnect', async () => {
        global.logger.info('socket disconnect!');
        handleLogoutRoom(socket);
      })

      const handleLogoutRoom = async (socket) => {
        try {
          ['room1', 'room2'].forEach(async (item) => {
            const roomid = item;
            const name = socket.name;
            if(users[roomid] && users[roomid].hasOwnProperty(name)) {
              delete users[roomid][name];
              global.logger.info(`${name} 退出了 ${roomid}`);
              const onlineUsers = {};
              for(let item in users[roomid]) {
                onlineUsers[item] = {};
                onlineUsers[item].src = users[roomid][item].src;
              }
              io.to(roomid).emit('roomout', { onlineUsers, roomid });
              socket.leave(roomid);
            }
          })

        } catch(e) {
          global.logger.info(e);
        }
      }
    })
}

// function findOne(query) {
//   return new Promise((resv, rej) => {
//     Count.findOne(query, (err, res) => {
//       if(err) {
//         rej(err);
//         return;
//       }
//       resv(res);
//     })
//   })
// }

module.exports = websocket