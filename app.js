const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { I18n } = require('i18n');
const mongoose = require('mongoose');
var config = require('./config/config');
const passport = require('passport')
const logger = require('./tools/logger');

const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');
const authRouter = require('./routes/auth');
const getLink = require('./routes/getLink');

const app = express();

// handle mongoose collection.ensureIndex warn

mongoose.connect(config.dbAddress,(error)=>{
  error && console.log(error.message);
});

//Config I18n
const i18n = new I18n({
  locales: ['en', 'fa', 'ar'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'fa',
  header: 'accept-language',
  queryParameter: 'lang',
  objectNotation: true,
  api: {
    __: 'msg', // now req.__ becomes req.t
    __n: 'msgn' // and req.__n can be called as req.tn
  }
});

app.use(i18n.init);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

require('./tools/auth'); //setup passport strategies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/dashboard',passport.authenticate('jwt', {session: false}), dashboardRouter);
app.use('/:shortenedCode', getLink);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  res.send('Not Found');
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('Server Error');
});

console.log(logger);
module.exports = app;
