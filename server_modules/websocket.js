const xssFilters = require('xss-filters');
const Count = require('../models/count');
const Message = require('../models/message');
function websocket(server) {
    const io = require('socket.io')(server);
    const users = {};
    const userRedis = {};

    setInterval(function() {
      // const keys = Object.keys(userRedis);
      for(let key in userRedis) {
        const info = userRedis[key] && userRedis[key].rooms;
        const username = key;
        const roomInfo = JSON.stringify(info);
        const value = {
          username,
          roomInfo
        }
        Count.findOne({username}, (err, res) => {
          if(err) {
            return;
          }
          if(res) {
            Count.update({username}, {roomInfo}, (err) => {
              if(err) {
                console.log('更新失败');
              }
            })
          } else {
            const count = new Count(value);
            count.save(function(err, res) {
              if(err) {
                global.logger.error(err);
                return;
              }
              global.logger.info(res);
            })
          }
        })
      }
    }, 1 * 60 * 1000);
    io.on('connection', function (socket) {
      //监听用户发布聊天内容
      console.log('socket connect!');
      socket.on('message', function (msgObj) {
        console.log('socket message!'); 
        //向所有客户端广播发布的消息
        const {username, src, msg, img, roomid, time} = msgObj;
        if(!msg && !img) {
          return;
        }
        // 后端限制字符长度
        const msgLimit = msg.slice(0, 200); 
        const mess = {
          username,
          src,
          msg: xssFilters.inHTMLData(msgLimit), // 防止xss
          img, 
          roomid,
          time
        }
        io.to(mess.roomid).emit('message', mess);
        global.logger.info(`${mess.username} 对房 ${mess.roomid} 说: ${mess.msg}`);
        if (mess.img === '') {
          const message = new Message(mess);
          message.save(function (err, res) {
            if (err) {
              global.logger.error(err);
              return;
            }
            global.logger.info(res);
          })
        }
        for (let name in userRedis) {
          if(!users[roomid][name]) {
            // 他人若不加入房间，无法初始化UserRooms
            initRedisUserRooms(name, roomid);
            const userR = userRedis[name];
            userR.rooms[roomid].count++;
            socket.to(userR.socketid).emit('count', userR.rooms);
          }
        }
        
      })
      // 建立连接
      socket.on('login',function (user) {
        console.log('socket login!');
        const {name} = user;
        if (!name) {
          return;
        }
        socket.name = name;

        initRedisUser(name);

        const userR = userRedis[name];

        Count.findOne({username: name}, (err, res) => {
          if(err) {
            return;
          }
          if(res) {
            console.log(res);
            const rooms = JSON.parse(res.roomInfo);
            // 数据库查数据， 若缓存中没有数据，更新缓存
            if(Object.keys(userR.rooms).length === 0) {
              userR.rooms = rooms;
            }
            // 通知自己有多少条未读消息
            socket.emit('count', rooms);
            return;
          }
          socket.emit('count', userR.rooms);
        })
        
      });
      // 加入房间
      socket.on('room', function(user) {
        console.log('socket add room!');
        const {name, roomid} = user;
        if (!name || !roomid) {
          return;
        }
        socket.name = name;
        socket.roomid = roomid;

        initRedisUser(name);

        // 当前在房间队列
        if (!users[roomid]) {
          users[roomid] = {};
        }
        // 初始化user
        users[roomid][name] = Object.assign({}, {
          socketid: socket.id
        }, user);

        // 进入房间默认置空，表示全部已读
        userRedis[name].rooms[roomid] = {
          count: 0
        }
        // 进行会话
        socket.join(roomid);

        const onlineUsers = {};
        for(let item in users[roomid]) {
          onlineUsers[item] = {};
          onlineUsers[item].src = users[roomid][item].src;
        }
        io.to(roomid).emit('room', onlineUsers);
        global.logger.info(`${name} 加入了 ${roomid}`);
      });

      socket.on('logout',function (user) {
        console.log('socket loginout!');
        const {name, roomid} = user;
        handleLogoutRoom(roomid, name);
      })
    
      socket.on('disconnect', function () {
        console.log('socket disconnect!');
        const {name, roomid} = socket;
        handleLogoutRoom(roomid, name);
      })

      function initRedisUserRooms(name, roomid) {
        // 初始化用户下的房间
        if(!userRedis[name].rooms[roomid]) {
          userRedis[name].rooms[roomid] = {
            count: 0
          }
          console.log('init数据count');
          console.log(userRedis);
        }
      }

      function initRedisUser(name) {
        // 初始化用户
        if (!userRedis[name]) {
          userRedis[name] = {
            rooms: {}
          };
        }
        // 初始化/更新socketid
        userRedis[name].socketid = socket.id;
      }

      function handleLogoutRoom(roomid, name) {
        try {
          if(users[roomid] && users[roomid].hasOwnProperty(name)) {
            const userR = userRedis[name];
            socket.emit('count', userR.rooms);
            delete users[roomid][name];
            global.logger.info(`${name} 退出了 ${roomid}`);
            io.to(roomid).emit('logout', users[roomid]);
            socket.leave(roomid);
          }
        } catch(e) {
          console.log(e);
        }
      }
    })
}

module.exports = websocket