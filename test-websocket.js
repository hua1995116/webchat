module.exports = {
  //可选，在建立连接之前会执行
  beforeConnect: function(client){
  },
  //必选，建立连接后所要做的事情
  onConnect: function(client, done){
    //向服务器发送消息
    const id = randomNumber();
    const src = `//s3.qiufengh.com/avatar/${Math.ceil(
        Math.random() * 272
      )}.jpeg`
    //client 为客户端的连接实例
    client.emit('login', {name: id});

    client.emit('room', {
      name: id,
      src,
      roomid: 'room1'
    })
    //回调函数
    done();
  },
  //必选，向服务器发送消息时运行的代码
  sendMessage: function(client, done) {
    console.log('send message');
    const src = `//s3.qiufengh.com/avatar/${Math.ceil(
        Math.random() * 272
      )}.jpeg`;

    const id = randomNumber();
    client.emit('message', {
      username: id,
      src,
      img: '',
      msg: 'test',
      roomid: 'room1',
      time: new Date()
    });
    done();
  }
};

function randomNumber(max){
  return Math.floor(Math.random()* (max || 100000));
}