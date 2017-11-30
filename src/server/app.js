const express = require('express');
const pathLib = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const statusLib = require('./libs/status');

const app = express();

// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

(function () {
  // cookie handler
  app.use(cookieParser());

  // session handler
  let arr = [];
  for (let i = 0; i < 100000; i++) {
    arr.push('keys_' + Math.random());
  }
  app.use(cookieSession({
    name: 'session_id',
    keys: arr,
    maxAge: 30 * 3600 * 1000
  }));
})();

// static resources handler
app.use(express.static(pathLib.join(__dirname, 'public', 'static')));

// routes handler
const api = require('./middlewares/route_api');
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res) {
  console.error(err);
  // render the error page
  res.status(err.status || 500);
  res.json(statusLib.SERVER_INNER_ERROR);
});

// cross-domain access
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

module.exports = app;
