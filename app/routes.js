var user = require('../controllers/user.js');
var sanitize = require('mongo-sanitize');

var isAuth = function(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}

var cleanInput = function(req, res, next) {
  req.params = sanitize(req.params);
  req.body = sanitize(req.body);
  next();
}

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      error: req.flash('error'),
      info: req.flash('info')
    });
  });

  app.get('/register', function(req, res) {
    res.render('register.ejs', {
      error: req.flash('error'),
      info: req.flash('info')
    });
  });

  app.get('/forgot', function(req, res) {
    res.render('forgot.ejs', {
      error: req.flash('error'),
      info: req.flash('info')
    });
  });

  app.post('/forgot', cleanInput, user.forgot.post);
  app.get('/reset/:token', user.reset.get);
  app.post('/reset/:token', cleanInput, user.reset.post);

  app.post('/register', cleanInput, passport.authenticate('local-register', {
    successRedirect: '/account',
    failureRedirect: '/register',
    failureFlash: true
  }));

  app.post('/login', cleanInput, passport.authenticate('local-login', {
    successRedirect: '/account',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/account', isAuth, function(req, res) {
    res.render('account.ejs', {
      error: req.flash('error'),
      info: req.flash('info'),
      user: req.user
    });
  });

  app.post('/account', isAuth, user.email.post);

  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
  }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/account',
      failureRedirect: '/'
    }));

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/account',
      failureRedirect: '/'
    }));

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/account',
      failureRedirect: '/'
    }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};