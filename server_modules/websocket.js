const xssFilters = require('xss-filters');
const Count = require('../models/count');
const Message = require('../models/message');
const User = require('../models/user');
const Socket = require('../models/socket');
let cache = {};

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

    setInterval(async () => {
      const usersList = await gethAllCache('socketId');
      for (let i = 0; i < usersList.length; i++) {
        const name = usersList[i];
        for (let j = 0; j < roomList.length; j++) {
          const roomid = roomList[j];
          const username = `${name}-${roomid}`;
          const roomInfo = await getCacheById(username);
          const res = await findOne({username});
          if(res) {
            Count.update({username}, {roomInfo}, (err) => {
              if(err) {
                console.log('更新失败');
              }
            })
          } else {
            const count = new Count({
              username,
              roomInfo: +roomInfo
            });
            count.save(function(err, res) {
              if(err) {
                global.logger.error(err);
                return;
              }
              global.logger.info(res);
            })
          }
        }
      }
    }, 1 * 60 * 1000);
    io.on('connection',  (socket) => {
      //监听用户发布聊天内容
      global.logger.info('socket connect!');
      socket.on('message', async (msgObj, fn) => {
        global.logger.info('socket message!');
        // console.log(name, msgObj, fn);
        fn(msgObj);
        //向所有客户端广播发布的消息
        const {username, src, msg, img, roomid, roomType, time, type, to, from} = msgObj;
        if(!msg && !img) {
          return;
        }
        // 后端限制字符长度
        const msgLimit = msg.slice(0, 200);
        const mess = {
          username,
          src,
          roomType,
          msg: xssFilters.inHTMLData(msgLimit), // 防止xss
          img,
          roomid,
          time,
          type,
          from,
          to
        }
        global.logger.info(msgObj);

        global.logger.info(`${mess.username} 对房 ${mess.roomid} 说: ${mess.msg}`);
        let msgRes = {};
        const message = new Message(mess);
        msgRes = await message.save();
        if(roomType === 'group') {
          io.to(mess.roomid).emit('message', msgRes);
          // 未读消息
          const usersList = await gethAllCache('socketId');
          usersList.map(async item => {
            if(!users[roomid][item]) {
              const key = `${item}-${roomid}`
              await inrcCache(key);
              const socketid = await gethCacheById('socketId', item);
              const count = await getCacheById(key);
              const roomInfo = {};
              roomInfo[roomid] = count;
              socket.to(socketid).emit('count', roomInfo);
            }
          })
        } else {
          const selfSockets = await Socket.find({ userId: from });
          selfSockets.forEach((socket) => {
            // 兼容多端设备
            global.logger.info('自己的id', socket.socketId);
            io.to(socket.socketId).emit('message', msgRes);
          });
          const friendSockets = await Socket.find({ userId: to });
          friendSockets.forEach((socket) => {
            // 兼容多端设备
            global.logger.info('被通知的id', socket.socketId);
            io.to(socket.socketId).emit('message', msgRes);
          });
        }

      })
      // 建立连接
      socket.on('login',async (user) => {
        const address = socket.handshake.headers['x-real-ip'] || socket.request.connection.remoteAddress;
        const ip = address.split(':').slice(-1).join('');
        const { browser, os, name, id, ua} = user;
        global.logger.info({ browser, os, name, id, ua});
        const socketRes = await Socket.findOne({userId: id ,ip: ip, browser: browser, os: os}).exec();
        global.logger.info("socketRes", socketRes);
        if(!socketRes) {
          const socketCtx = {
            browser,
            os,
            userId: id,
            ua,
            socketId: socket.id,
            ip,
          }

          const addSocket = await new Socket(socketCtx).save();
          global.logger.info("addSocket", addSocket);
        } else {
          const updateRes = await Socket.update({userId: id ,ip: ip, browser: browser, os: os}, {socketId: socket.id}).exec();
          global.logger.info('updateRes');
        }
        global.logger.info('socket login!', user, socket.id, address, ip);
        if (!name) {
          return;
        }
        socket.name = name;
        const roomInfo = {};
        await updatehCache('socketId', name, socket.id);

        for(let i = 0; i < roomList.length; i++) {
          const roomid = roomList[i];
          const key = `${name}-${roomid}`;
          // 循环所有房间
          const res = await findOne({username: key});
          const count = await getCacheById(key);

          if(res) {
            // 数据库查数据， 若缓存中没有数据，更新缓存
            if(+count === 0) {
              updateCache(key, res.roomInfo);
            }
            roomInfo[roomid] = res.roomInfo;
          } else {
            roomInfo[roomid] = +count;
          }
        }
        // 通知自己有多少条未读消息
        socket.emit('count', roomInfo);

      });
      // 加入房间
      socket.on('room', async (user) => {
        global.logger.info('socket add room!');
        const {name, roomid} = user;
        if (!name || !roomid) {
          return;
        }
        socket.name = name;
        socket.roomid = roomid;

        if (!users[roomid]) {
          users[roomid] = {};
        }
        // 初始化user
        users[roomid][name] = Object.assign({}, {
          socketid: socket.id
        }, user);

        // 初始化user
        const key = `${name}-${roomid}`;
        await updatehCache('socketId', name, socket.id);

        // 进入房间默认置空，表示全部已读
        await resetCacheById(key);
        // 进行会话
        socket.join(roomid);

        const onlineUsers = {};
        for(let item in users[roomid]) {
          onlineUsers[item] = {};
          onlineUsers[item].src = users[roomid][item].src;
        }
        io.to(roomid).emit('room', { onlineUsers, roomid });
        global.logger.info(`${name} 加入了 ${roomid}`);
      });

      socket.on('roomout', async (user) => {
        global.logger.info('socket loginout!');
        const {name, roomid} = user;
        await handleLogoutRoom(roomid, name);
      })

      socket.on('disconnect', async () => {
        global.logger.info('socket disconnect!');
        const {name, roomid} = socket;
        await handleLogoutRoom(roomid, name);
      })

      const handleLogoutRoom = async (roomid, name) => {
        try {
          if(users[roomid] && users[roomid].hasOwnProperty(name)) {
            const key = `${name}-${roomid}`;
            const roomInfo = {};
            const count = await getCacheById(key);
            roomInfo[roomid] = count;
            socket.emit('count', roomInfo);
            delete users[roomid][name];
            global.logger.info(`${name} 退出了 ${roomid}`);
            io.to(roomid).emit('roomout', users[roomid]);
            socket.leave(roomid);
          }
        } catch(e) {
          global.logger.info(e);
        }
      }
    })
}

function findOne(query) {
  return new Promise((resv, rej) => {
    Count.findOne(query, (err, res) => {
      if(err) {
        rej(err);
        return;
      }
      resv(res);
    })
  })
}

module.exports = websocket