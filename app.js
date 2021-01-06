require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const methodOverride = require('method-override')
const sessionFileStore = require('session-file-store')
const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/users');
const session = require('express-session')
const app = express();
const hbs = require('hbs')
const mongoose = require("mongoose");
const dbConnect = require('./src/config/dbConnect')
const userMiddle = require('./src/middleware/user')
const accountRouter = require('./src/routes/account')
const fs = require('fs')
const PORT = process.env.PORT || 3000
const newtripRoute = require('./src/routes/newtrip')
const mailRoute = require('./src/routes/mail')
dbConnect()
app.set('session cookie name', 'sid')
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src', 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'src', 'partials'))
hbs.registerHelper('htmlTemplate', (name) => {
  const template = fs.readFileSync(`./src/views/${name}.hbs`, 'utf8')
  return template;
})

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const FileStore = sessionFileStore(session)
app.use(session({
  name: app.get('session cookie name'),
  secret: process.env.SESSION_SECRET,
  store: new FileStore({
    secret: process.env.SESSION_SECRET,
  }),
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false
  },
}))

app.use(userMiddle.userName)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/account', userMiddle.isAuth, accountRouter)
app.use('/newtrip', userMiddle.isAuth, newtripRoute)
app.use('/mail', mailRoute)

app.use(function (req, res, next) {
  res.render('404')
});

app.listen(PORT, () => {
  console.log('Server has been started on port: ', PORT)
})

module.exports = app;
