const createError = require('http-errors');
const express = require('express');
const path = require('path');
// const mysql = require('mysql');
const mariadb = require('mariadb');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

const config = require('./config/app');
const auth = require('./config/auth');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const fbRouter = require('./routes/facebook');

const app = express();

// create connection to database
// const db = mysql.createConnection({
//   host: auth.database.dbHost,
//   user: auth.database.dbUser,
//   password: auth.database.dbPass,
//   database: auth.database.dbName
// });
const pool = mariadb.createPool({
  host: auth.database.dbHost,
  user: auth.database.dbUser,
  password: auth.database.dbPass,
  database: auth.database.dbName,
  connectionLimit: 5
});

// connect to database
// db.connect((err) => {
//   if (err) {
//       throw err;
//   }
//   console.log('Connected to database');
// });
console.log('Connecting to Database...');

async function connectToDB() {
  let db;
  try {
    db = await pool.getConnection();
    // const rows = await db.query("SELECT 1 as val");
    // console.log(rows); //[ {val: 1}, meta: ... ]
    // const res = await db.query("INSERT INTO myTable value (?, ?)", [1, "m ariadb"]);
    // console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
    global.db = db;
  } catch (err) {
	  throw err;
  }
}

connectToDB()
  .then(() => {
    console.log('Connected to Database');
  })
  .catch((err) => {
    console.log('Unable to connect to the database', err);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/fb', fbRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
