var async = require('async');
var crypto = require('crypto');
var User = require('../models/users.js');
var mail = require('../config/mail.js');

module.exports.forgot = {
  post: function (req, res, next) {
    async.waterfall([
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({
          email: req.body.email,
          type:'local'
        }, function (err, user) {
          if (!user) {
            req.flash('message', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        mail.sendForgot(req, user.email, token, function (err) {
          req.flash('message', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err);
        });
      }
    ], function (err) {
      if (err) {
        return next(err);
      }

      res.redirect('/forgot');
    });
  }
};

module.exports.reset = {
  get: function (req, res) {
    User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    }, function (err, user) {
      if (!user) {
        req.flash('message', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset.ejs', {
        user: req.user,
        message: req.flash('message')
      });
    });
  },

  post: function (req, res) {
    async.waterfall([
      function (done) {
        User.findOne({
          resetPasswordToken: req.params.token,
          resetPasswordExpires: {
            $gt: Date.now()
          }
        }, function (err, user) {
          if (!user) {
            req.flash('message', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }

          user.password = user.generateHash(req.body.password);
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function (err) {
            req.logIn(user, function (err) {
              done(err, user);
            });
          });
        });
      },
      function (user, done) {
        mail.sendReset(user.email, function (err) {
          req.flash('message', 'Success! Your password has been changed.');
          return res.redirect('/forgot');
        });
      }
    ], function (err) {
      res.redirect('/');
    });
  }
};