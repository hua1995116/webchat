var express = require('express');
var config = require('./config/index');
var port = process.env.PORT || config.dev.port;

var app = express();

var router = express.Router();
// 用于静态展示入口
router.get('/',function(req,res,next){
	req.url = './index.html';
	next();
});

app.use(router);


/*引入*/
var mongoose = require('mongoose')
// 日志文件
var morgan = require('morgan')
// sesstion 存储
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('cookie-session')
// 用于异步回调
mongoose.Promise = require('bluebird')
global.db = mongoose.connect("mongodb://localhost:27017/vuechat")

// 服务器提交的数据json化
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
// sesstion 存储
app.use(cookieParser())
app.use(session({
  secret: 'vuechat',
  resave: false,
  saveUninitialized: true
}))

var env = process.env.NODE_ENV || 'development'
if ('development' === app.get('env')) {
  app.set('showStackError', true)
  app.use(morgan(':method :url :status'))
  app.locals.pretty = true
  mongoose.set('debug', true)
}

var server = app.listen(port)

// websocket
// var http = require('http').Server(app);
var io = require('socket.io')(server);
var Message = require('./models/message')
var users = {}
io.on('connection', function (socket) {
  //监听用户发布聊天内容
  socket.on('message', function (obj) {
    //向所有客户端广播发布的消息
    io.emit('message', obj)
    var mess = {
      username: obj.username,
      src:obj.src,
      msg: obj.msg,
      roomid:'room1'
    }
    var message = new Message(mess)
    //将发送过来的消息进行储存
    message.save(function (err, mess) {
      if (err) {
        console.log(err)
      }
        console.log(mess)
    })
    console.log(obj.username + '说：' + obj.msg)
  })
  socket.on('login',function (obj) {
    users[obj.name] = obj
    //用于监听用户进行聊天室
    io.emit('login', users)
  })
  socket.on('logout',function (name) {
    delete users[name]
    //用户监听用退出聊天室
    io.emit('logout', users)
  })
})

require('./config/routes')(app)
//声明静态资源地址
app.use(express.static('./dist'));
