let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let morgan = require('morgan');
const fs = require('fs')
const http = require("http");
var app = express();
import {swaggerConfig} from './config/swagger'

// view engine setup (不使用模板引擎)
/*
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
*/

// 配置 swagger
const generateSpecAndMount = require('express-swagger-generator')(app)
generateSpecAndMount(swaggerConfig)
// 开放 swagger 相关接口文档的文件返回
app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerConfig);
});

// 动态获取一个文件夹下面的路由文件，并且绑定到 app上
let routes = require('require-dir')('./routes', {recurse: true});
Object.keys(routes).map(function (r, i) {
  if (typeof routes[r] == 'function')
    app.use('/' + r, routes[r]);
});

// 日志 ⾃定义token
morgan.token('from', function (req, res) {
  return req.query.from || '-';
});
// ⾃定义format，其中包含⾃定义的token
morgan.format('joke', '[joke] :method :url :status :from');
// 开发模式的morgan日志输出
app.use(morgan('joke'));

// json 处理器
app.use(express.json());

// url 编码
app.use(express.urlencoded({extended: false}));

// cookie解析器
app.use(cookieParser());

// 输出打包好的静态文件
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler in dev-mode
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let port = normalizePort(process.env.PORT || '4000');
app.set('port', port);
let server = http.createServer(app);
server.listen(port);
let debug = require('debug')('server:server');

server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;
