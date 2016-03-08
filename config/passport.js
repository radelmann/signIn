var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user.js');
var config = require('./env.js');
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
            'email': email,
            'type': 'local'
          })
          .then(function (user) {
            if (user) {
              return done(null, false, req.flash('error', 'That email is already in use. Please try again.'));
            } else {

              var newUser = new User();
              newUser.name = req.body.name;
              newUser.type = 'local';
              newUser.email = email;
              newUser.password = newUser.generateHash(password);

              newUser.save(function (err, saved) {
                if (err) {
                  done(err);
                }
                //send welcome email
                mail.sendWelcome(saved.email, saved.name, function (err) {
                  return done(err, saved);
                });
              });

            }
          }, function (err) {
            return done(err);
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
          'email': email,
          'type': 'local'
        })
        .then(function (user) {
          if (!user) {
            return done(null, false, req.flash('error', 'Email does not exist. Please try again.'));
          }

          if (!user.validPassword(password)) {
            return done(null, false, req.flash('error', 'Incorrect password. Please try again.'));
          }

          return done(null, user);
        }, function (err) {
          return done(err)
        });

    }));

  passport.use(new FacebookStrategy({
      clientID: config.facebookAuth.clientID,
      clientSecret: config.facebookAuth.clientSecret,
      callbackURL: config.facebookAuth.callbackURL,
      profileFields: ['id', 'displayName', 'photos', 'email']
    },

    function (token, refreshToken, profile, done) {

      process.nextTick(function () {

        User.findOne({
            'profileId': profile.id,
            'type': 'facebook'
          })
          .then(function (user) {
            if (user) {
              return done(null, user);
            } else {

              var newUser = new User();

              newUser.type = 'facebook';
              newUser.profileId = profile.id;
              newUser.name = profile.displayName;
              newUser.email = profile.emails[0].value;

              newUser.save(function (err, saved) {
                if (err) {
                  done(err);
                }

                //send welcome email
                mail.sendWelcome(saved.email, saved.name, function (err) {
                  return done(err, saved);
                });
              });
            }
          }, function (err) {
            done(err);
          });

      });
    }));

  passport.use(new TwitterStrategy({
      consumerKey: config.twitterAuth.consumerKey,
      consumerSecret: config.twitterAuth.consumerSecret,
      callbackURL: config.twitterAuth.callbackURL
    },
    function (token, tokenSecret, profile, done) {

      process.nextTick(function () {

        User.findOne({
            'profileId': profile.id,
            'type': 'twitter'
          })
          .then(function (user) {
            if (user) {
              return done(null, user); // user found, return that user
            } else {

              var newUser = new User();

              newUser.profileId = profile.id;
              newUser.type = 'twitter';
              newUser.name = profile.displayName;
              newUser.email = '';

              newUser.save(function (err, saved) {
                if (err) {
                  done(err);
                }
                //cannot send welcome email since twitter does not return it
                return done(err, saved);
              });
            }
          }, function (err) {
            done(err);
          });

      });
    }));
};