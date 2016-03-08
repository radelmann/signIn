var config = require('./env.js');

var mailer = require("mailer");

module.exports.sendWelcome = function (to, cb) {
  mailer.send({
    host: config.smtp_host,
    port: 587,
    to: to,
    from: config.smtp_from,
    subject: "Welcome to signIn",
    body: "Welcome to signIn!",
    authentication: "login",
    username: config.smtp_user,
    password: config.smtp_password
  }, function (err, result) {
    if (err) {
      console.log(err);
    }
  });
}

module.exports.sendForgot = function (req, to, token, cb) {
  var body = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
    '<a href="http://' + req.headers.host + '/reset/' + token + '>Click here to reset your password</a>.\n\n' +
    'If you did not request this, please ignore this email and your password will remain unchanged.\n';

  mailer.send({
    host: config.smtp_host,
    port: 587,
    to: to,
    from: config.smtp_from,
    subject: "signIn - Forgot Password",
    body: body,
    authentication: "login",
    username: config.smtp_user,
    password: config.smtp_password
  }, function (err, result) {
    cb(err, result);
  });
}

module.exports.sendReset = function (to, cb) {
  var body = 'This is a confirmation that the password for your account ' + to + ' has just been changed.\n';

  mailer.send({
    host: config.smtp_host,
    port: 587,
    to: to,
    from: config.smtp_from,
    subject: "Your password has been changed",
    body: body,
    authentication: "login",
    username: config.smtp_user,
    password: config.smtp_password
  }, function (err, result) {
    cb(err, result);
  });
}