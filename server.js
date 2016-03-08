var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var env = require('./config/env.js');

mongoose.connect(env.db-url);

app.use(morgan('dev')); 
app.use(cookieParser()); 
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs'); 

app.use(session({
  secret: env.session-secret
})); 

app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 

require('./app/routes.js')(app, passport); 

app.listen(env.port, function() {
  console.log('listening on port: ' env.port);
});