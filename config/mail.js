var config = require('./env.js');

var mailer = require("mailer"),
  username = config.smtp_user,
  password = config.smtp_password;

module.exports.sendWelcome = function (to) {
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