# vue+websocket+express+mongodb实战项目（实时聊天）
博客地址：[http://blog.csdn.net/blueblueskyhua/article/details/70807847](http://blog.csdn.net/blueblueskyhua/article/details/70807847)
```
npm install -----安装依赖
npm run dev -----运行
npm run build -----打包
node prod.server.js -----打包后运行
//记得替换
Index.vue和Chat.vue下的io.connect('http://qiufengh.com:8081')
http://qiufengh.com:8081改成自己的项目地址。
```
在线观看
[http://www.qiufengh.com:8081/#/](http://www.qiufengh.com:8081/#/)


继上一个项目[用vuejs仿网易云音乐（实现听歌以及搜索功能）](https://github.com/hua1995116/musiccloudWebapp)后，发现上一个项目单纯用vue的model管理十分混乱，然后我去看了看vuex，打算做一个项目练练手，又不想做一个重复的项目，这次我就放弃颜值，打算走心派。结合了后台nodejs，以及数据库mongodb来开发了一个实时聊天系统。这个系统可以说是一统江山，也算是实现前端程序员的一个梦了，前后通吃。自认为是一个比全的项目。项目地址：[https://github.com/hua1995116/webchat](https://github.com/hua1995116/webchat) 觉得好的请顺手来个star。

![这里写图片描述](http://img.blog.csdn.net/20170426135802018)
### 实现功能
- [x] 聊天功能 -- 完成
- [x] 多个聊天室 -- 完成
- [x] 与机器人对接 -- 完成
- [x] 图片发送 -- 完成
- [x] 注册功能 -- 完成
- [x] 登录功能 -- 完成

### 技术栈

 - 前端 vue，vue-router ,vuex
 - 后端 nodejs，express
 - 数据库 mongodb
 - 通讯 websocket
 - 脚手架工具 vue-cli

### 结构
├─build 
├─config 
├─models(存放mongoose对象)
├─schemas（存放mongoose的schemas模型）
├─src
│  │  App.vue
│  │  main.js（主入口）
│  ├─assets    
│  ├─components   （组件）
│  ├─router（vue-router路由）
│  └─store（vuex）
└─static（静态资源）

首先用脚手架工具构建一个项目。像这样：

```
vue init webpack my-project-name
```
结构大致是这样的

![这里写图片描述](http://img.blog.csdn.net/20170426163230168?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvYmx1ZWJsdWVza3lodWE=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

好！既然我们是实战项目，我就不多说这些配置问题。不然又跑题了。不然又要被小哥哥小姐姐们打了。

![这里写图片描述](http://img.blog.csdn.net/20170426140218399?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvYmx1ZWJsdWVza3lodWE=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

### 前端

首先看src目录下的页面布局。
main.js// 主入口
```
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// 使用museui组件
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
Vue.use(MuseUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
```
我们为了让整个项目看起来漂漂亮亮的，所以选择了muse-ui，别说，这个UI框架是真的漂亮。不信大家可以看[muse-ui](http://www.muse-ui.org/#/install)。其余都是脚手架的默认配置。

route/router.js

```
import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Robot from '@/components/Robot'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/robot',
      name: 'Robot',
      component: Robot
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    }
  ]
})
```
大家可以看到一共有三个路由，没错，我们就是写了三块，第一块是和大家一起的聊天室，第二块是和我们可爱的大白聊天，也就是我们的[图灵机器人](http://www.tuling123.com/)。有空你也去搞一个耍耍。第三块就是我们的个人中心，虽然这一块没什么东西。但是毕竟好看，哦~忘了，我们是走心的，怎么可以只看脸。

components/Chat.vue

```
created() {
    const that = this
    this.socket = io.connect('http://qiufengh.com:8081')
    this.socket.on('message', function(obj) {
        that.$store.commit('addRoomDetailInfos', obj)
        window.scrollTo(0, 900000)
    })
    this.socket.on('logout', function (obj) {
        that.$store.commit('setUsers', obj)
    })
},
```

```
this.socket = io.connect('http://qiufengh.com:8081')
```
这一句，主要用于连接你当前的服务，到时候下载后面的项目时，记得改成自己的服务以及端口。因为是在Index和Chat都有设置，所以你需要在Index.vue和Chat里的connect都改成你自己的服务。socket.on()用于接受消息。socket.emit() 用于发送消息。不懂的socket.io的看这里[socket.io](https://socket.io/docs/)。有了这个就可以和服务端进行交互。等会讲解服务端。

store/index.js
```
state: {
 //存放用户
  user: {
    name: '',
    src: ''
  },
  //存放历史记录
  messhistory: {
    infos: []
  },
  //存放房间信息，为了方便以后做多房间
  roomdetail: {
    id: '',
    users: {},
    infos: []
  },
  //存放机器人开场白
  robotmsg: [{
    message: 'Hi~有什么想知道的可以问我',
    user: 'robot'
  }],
  //聊天页面显示控制
  chattoggle: false,
  //登录页面显示控制
  logintoggle: false,
  //注册页面显示控制
  registertoggle: true,
  //提示框显示控制
  dialog: false,
   //提示框内容
  dialoginfo: ''
}
```
由于控制代码太多，所以之后的内容请大家移步，我的github地址。[https://github.com/hua1995116/webchat/](https://github.com/hua1995116/webchat/)

### 服务器端

由于build下dev-server.js中webpack代码太多，太杂乱，不易于讲解。主要来看看用于打包后的服务器端。两份代码是一样的。
prod.server.js（根目录下）
```
var express = require('express');
var config = require('./config/index');
var port = process.env.PORT || config.dev.port;

var app = express();

var router = express.Router();
//用于静态展示入口
router.get('/',function(req,res,next){
	req.url = './index.html';
	next();
});

app.use(router);

require('./config/routes')(app)
/*引入*/
var mongoose = require('mongoose')
//日志文件
var morgan = require('morgan')
//sesstion 存储
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('cookie-session')
//用于异步回调
mongoose.Promise = require('bluebird')
global.db = mongoose.connect("mongodb://localhost:27017/vuechat")

//服务器提交的数据json化
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
//sesstion 存储
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

//websocket
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

//声明静态资源地址
app.use(express.static('./dist'));
```

### schema模型

schema/user.js
```
var mongoose = require('mongoose')
//用于md5加密
var bcrypt = require('bcryptjs')
//加盐数
var SALT_WORK_FACTOR = 10
var UserSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  password: String,
  src: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});
//对密码进行加密
UserSchema.pre('save', function (next) {
  var user = this
  if (this.isNew) {
    this.createAt = this.updateAt = Date.now()
  }
  else {
    this.updateAt = Date.now()
  }
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })
})
//用于比较密码是否正确
UserSchema.methods = {
  comparePassword: function (_password, cb) {
    bcrypt.compare(_password, this.password, function (err, isMatch) {
      if (err) return cb(err)
      cb(null, isMatch)
    })
  }
}

UserSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = UserSchema
```


这里主要用到一个md5的模块，可以查看 [bcryptjs](https://www.npmjs.com/package/bcryptjs)

schema/message.js

```
var mongoose = require('mongoose')
//聊天记录模型
var MessageSchema = new mongoose.Schema({
  username: String,
  src:String,
  msg: String,
  roomid:String,
  time: {
    type: Date,
    default: Date.now()
  }
})
//静态方法
MessageSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort('time')
      .exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}
module.exports = MessageSchema
```

服务器的routes
config/routes.js 讲一个注册的把，其他请前往项目查看
```
app.post('/user/signup', function (req, res) {
    //获取提交数据
    var _user = req.body
    console.log(_user)
    User.findOne({name: _user.name}, function (err, user) {
      if (err) {
        console.log(err)
      }
      if (user) {
        res.json({
          errno: 1,
          data: '用户名已存在'
        })
      } else {
        var user = new User(_user)
        user.save(function (err, user) {
          if (err) {
            console.log(err)
          }
          res.json({
            errno: 0,
            data: '注册成功'
          })
        })
      }
    })
  })
```

主要用于验证用户名是否重复。

核心部分就讲到这里啦，。其他具体的请查看我的github地址（具有详细的注释，不明白的可以提问，需要改进的请各位前辈指出）：
地址：[https://github.com/hua1995116/webchat](https://github.com/hua1995116/webchat)
在线观看地址：[http://www.qiufengh.com:8081/#/](http://www.qiufengh.com:8081/#/)
```
npm install -----安装依赖
npm run dev -----运行
npm run build -----打包
node prod.server.js -----打包后运行
//记得替换
Index.vue和Chat.vue下的io.connect('http://qiufengh.com:8081')
http://qiufengh.com:8081改成自己的项目地址。
```

最后上几张图。

![这里写图片描述](http://img.blog.csdn.net/20170426160852057?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvYmx1ZWJsdWVza3lodWE=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
![这里写图片描述](http://img.blog.csdn.net/20170426160909313?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvYmx1ZWJsdWVza3lodWE=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
![这里写图片描述](http://img.blog.csdn.net/20170426160936933?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvYmx1ZWJsdWVza3lodWE=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
![这里写图片描述](http://img.blog.csdn.net/20170426160946449?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvYmx1ZWJsdWVza3lodWE=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)


