var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users.js');
var mail = require('../config/mail.js');

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use('local-register', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, email, password, done) {
      process.nextTick(function () {

        User.findOne({
          'email': email
        }, function (err, user) {
          if (err)
            return done(err);

          if (user) {
            return done(null, false, req.flash('registerMessage', 'That email is already in use. Please try again.'));
          } else {

            var newUser = new User();

            newUser.email = email;
            newUser.password = newUser.generateHash(password);

            newUser.save(function (err) {
              if (err)
                throw err;
              //to do - send welcome email
              mail.sendWelcome(newUser.email);
              return done(null, newUser);
            });
          }
        });
      });
    }));

  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, email, password, done) {
      User.findOne({
        'email': email
      }, function (err, user) {
        if (err)
          return done(err);
        if (!user)
          return done(null, false, req.flash('loginMessage', 'Email does not exist. Please try again.'));
        if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Incorrect password. Please try again.'));
        return done(null, user);
      });
    }));
};