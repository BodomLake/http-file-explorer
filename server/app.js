var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs')
const http = require("http");
var app = express();

// view engine setup (不使用模板引擎)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


import { swaggerConfig } from './config/swagger'
const expressSwagger = require('express-swagger-generator')(app)
expressSwagger(swaggerConfig)

// 开放 swagger 相关接口，
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerConfig);
});

var routes = require('require-dir')('./routes', {recurse: true});
// console.log(routes)
Object.keys(routes).map(function (r, i) {
  // console.log('路由：', r)
  if (typeof routes[r] == 'function')
    app.use('/' + r, routes[r]);
});
// 开发模式的日志
app.use(logger('dev'));
app.use(express.json());
// url 编码
app.use(express.urlencoded({extended: false}));
// cookie解析器
app.use(cookieParser());
// 输出打包好的静态文件
app.use(express.static(path.join(__dirname, 'public')));
// 输出swagger接口 页面
// app.use('/swagger/', express.static(path.join(__dirname, 'swagger')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// import swaggerUi from 'swagger-ui-express'
// import swaggerJSDoc from 'swagger-jsdoc'



// error handler in dev-mode
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = normalizePort(process.env.PORT || '4000');
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
var debug = require('debug')('server:server');
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

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

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

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
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
module.exports = app;
