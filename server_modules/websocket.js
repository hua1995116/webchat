function websocket(server) {
    var io = require('socket.io')(server);
    var Message = require('../models/message')
    var users = {}
    
    io.on('connection', function (socket) {
      //监听用户发布聊天内容
      console.log('socket connect!');      
      socket.on('message', function (obj) {
        console.log('socket message!'); 
        //向所有客户端广播发布的消息
        var mess = {
          username: obj.username,
          src:obj.src,
          msg: obj.msg,
          img: obj.img,
          roomid: obj.room,
          time: obj.time
        }
        io.to(mess.roomid).emit('message', mess)
        global.logger.info(obj.username + '对房' + mess.roomid+'说：'+ mess.msg)
        // console.log(obj.username + '对房' + mess.roomid+'说：'+ mess.msg)
        if (obj.img === '') {
          var message = new Message(mess)
          message.save(function (err, mess) {
            if (err) {
              // console.log(err)
              global.logger.error(err)
            }
            // console.log(mess)
            global.logger.info(mess)
          })
        }
      })
      socket.on('login',function (obj) {
        console.log('socket login!');
        if (!obj.name) {
          return;
        }
        socket.name = obj.name
        socket.room = obj.roomid
        if (!users[obj.roomid]) {
          users[obj.roomid] = {}
        }
        users[obj.roomid][obj.name] = obj
        socket.join(obj.roomid)
        io.to(obj.roomid).emit('login', users[obj.roomid])
        global.logger.info(obj.name + '加入了' + obj.roomid)
      })
      socket.on('logout',function (obj) {
        try{
          console.log('socket loginout!');
          const is = Object.hasOwnProperty.call(users[obj.roomid], obj.name)
          if (is) {
            delete users[obj.roomid][obj.name]
            global.logger.info(obj.name + '退出了' + obj.roomid)
            io.to(obj.roomid).emit('logout', users[obj.roomid])
            socket.leave(obj.roomid)
          }
        } catch (e) {
          global.logger.error(e)
        }
      })
    
      socket.on('disconnect', function (e) {
        console.log(e);
        console.log('socket disconnect!');
        console.log(socket.room, socket.name);
        if (users[socket.room] && users[socket.room].hasOwnProperty(socket.name)) {
          delete users[socket.room][socket.name]
          // 用户监听用退出聊天室
          global.logger.info(socket.name + '退出了' + socket.room)
          socket.leave(socket.roomid)
          io.to(socket.room).emit('logout', users[socket.room])
        }
      })
    })
}

module.exports = websocket