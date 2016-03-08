var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/users.js');
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
          'type':'local'
        }, function (err, user) {
          if (err)
            return done(err);

          if (user) {
            return done(null, false, req.flash('registerMessage', 'That email is already in use. Please try again.'));
          } else {

            var newUser = new User();

            newUser.type = 'local';
            newUser.email = email;
            newUser.password = newUser.generateHash(password);

            newUser.save(function (err) {
              if (err)
                throw err;
              //send welcome email
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
        'email': email,
        'type':'local'
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

  passport.use(new FacebookStrategy({
      clientID: config.facebookAuth.clientID,
      clientSecret: config.facebookAuth.clientSecret,
      callbackURL: config.facebookAuth.callbackURL,
      profileFields: ['id', 'displayName', 'photos', 'email']
    },

    function (token, refreshToken, profile, done) {
      // asynchronous
      process.nextTick(function () {

        // find the user in the database based on their facebook id
        User.findOne({
          'profileId': profile.id,
          'type':'facebook'
        }, function (err, user) {

          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err)
            return done(err);

          // if the user is found, then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();
            newUser.type = 'facebook';
            // set all of the facebook information in our user model
            newUser.profileId = profile.id; // set the users facebook id                   
            //newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
            //newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
            console.log(profile);
            newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

            // save our user to the database
            newUser.save(function (err) {
              if (err)
                throw err;

              // if successful, return the new user
              return done(null, newUser);
            });
          }

        });
      });
    }));
};