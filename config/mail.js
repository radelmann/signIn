var config = require('./env.js');
var nodemailer = require('nodemailer');

var sendMail = function (toEmail, subject, content, cb) {
  var smtpConfig = {
    host: config.smtp_host,
    port: config.smtp_port,
    secure: false, 
    auth: {
      user: config.smtp_user,
      pass: config.smtp_password
    }
  };

  var mailData = {
    from: config.smtp_from,
    subject: subject,
    to: toEmail,
    html: content
  };

  var transporter = nodemailer.createTransport(smtpConfig);

  transporter.sendMail(mailData, function (err, result) {
    cb(err, result);
  });
}

module.exports.sendWelcome = function (toEmail, name, cb) {
  var subject = 'Welcome to signIn!';

  var content = ['Hi ' + name + ' ,',
    'Your signIn account is now active.',
    'Thank you for registering.',
    'signIn Inc.'
  ].join('<br><br>');


  sendMail(toEmail, subject, content, cb);
}

module.exports.sendForgot = function (toEmail, host, token, cb) {
  var subject = 'signIn - Forgot Password';

  var content = ['You are receiving this because you have requested the reset of the password for your account.',
    'Please click on the following link, or paste this into your browser to complete the process:',
    '<a href="http://' + host + '/reset/' + token + '">Click here to reset your password</a>.',
    'If you did not request this, please ignore this email and your password will remain unchanged.', 'signIn Inc.'
  ].join('<br><br>');

  sendMail(toEmail, subject, content, cb);
}

module.exports.sendReset = function (toEmail, cb) {
  var subject = 'signIn - Changed Password Confirmation';

  var content = ['This is a confirmation that the password for your email: ' + toEmail + ' has just been changed.',
    'signIn Inc'
  ].join('<br><br>');

  sendMail(toEmail, subject, content, cb);
}