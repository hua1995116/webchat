require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)
/*引入*/
var mongoose = require('mongoose')
//日志文件
var morgan = require('morgan')
//sesstion 存储
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('cookie-session')
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

require('../config/routes')(app)
/*引入*/




var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {
  }
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({action: 'reload'})
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = {target: options}
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

// http.listen(8080, function(){
//   console.log('listening on *:3000');
// });

var server = app.listen(port)

//websocket
// var http = require('http').Server(app);
var io = require('socket.io')(server);
var Message = require('../models/message')
var users = {}
io.on('connection', function (socket) {
  //监听用户发布聊天内容
  socket.on('message', function (obj) {
    //向所有客户端广播发布的消息
    console.log(obj)
    io.emit('message', obj)
    var mess = {
      username: obj.username,
      src:obj.src,
      msg: obj.msg,
      roomid:'room1'
    }
    var message = new Message(mess)
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
    io.emit('login', users)
  })
  socket.on('logout',function (name) {
    delete users[name]
    io.emit('logout', users)
  })
})



module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
