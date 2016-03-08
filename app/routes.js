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
        res.render('signup.ejs', {
            message: req.flash('registerMessage')
        });
    });

    app.get('/account', isAuth, function (req, res) {
        res.render('account.ejs', {
            user: req.user
        });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};