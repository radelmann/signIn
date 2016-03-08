var async = require('async');
var crypto = require('crypto');
var User = require('../models/user.js');
var mail = require('../config/mail.js');

var Q = require('q');
var getToken = Q.denodeify(crypto.randomBytes);

var token;

module.exports.forgot = {
  post: function (req, res, next) {
    getToken(20)
      .then(function (buffer) {
        token = buffer.toString('hex');
        console.log(token);
        return User.findOne({
          email: req.body.email,
          type: 'local'
        });
      })
      .then(function (user) {
        if (!user) {
          req.flash('message', 'No account with that email address exists.');
          res.redirect('/forgot');
        } else {
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          return user.save();
        }
      })
      .then(function (user) {
        mail.sendForgot(user.email, req.headers.host, token, function (err, results) {
          req.flash('message', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          res.redirect('/forgot');
        });
      })
      .catch(function (err) {
        next(err);
      });
  }
};

module.exports.reset = {
  get: function (req, res, next) {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      })
      .then(function (user) {
        if (!user) {
          req.flash('message', 'Password reset token is invalid or has expired.');
          return res.redirect('/forgot');
        }
        res.render('reset.ejs', {
          user: req.user,
          message: req.flash('message')
        });
      }, function (err) {
        next(err);
      });
  },

  post: function (req, res, next) {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      })
      .then(function (user) {
        if (!user) {
          req.flash('message', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = user.generateHash(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function (err, saved) {
          if (err) {
            next(err);
          }
          mail.sendReset(user.email, function (err, results) {
            if (err) {
              next(err);
            }
            req.flash('message', 'Success! Your password has been changed.');
            return res.redirect('/forgot');
          });
        });
      }, function (err) {
        console.log(err);
        next(err);
      });
  }
};