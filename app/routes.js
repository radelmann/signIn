var password = require('../controllers/passwordReset.js');

var isAuth = function (req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}

module.exports = function (app, passport) {
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  app.get('/login', function (req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  app.get('/register', function (req, res) {
    res.render('register.ejs', {
      message: req.flash('registerMessage')
    });
  });

  app.get('/forgot', function (req, res) {
    res.render('forgot.ejs', {
      message: req.flash('message')
    });
  });

  app.post('/forgot', password.forgot.post);
  app.get('/reset/:token', password.reset.get);
  app.post('/reset/:token', password.reset.post);

  app.post('/register', passport.authenticate('local-register', {
    successRedirect: '/account',
    failureRedirect: '/register',
    failureFlash: true
  }));

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/account',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/account', isAuth, function (req, res) {
    res.render('account.ejs', {
      user: req.user
    });
  });

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


  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });
};