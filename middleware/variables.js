module.exports = function (req, res, next){
    if(req.session.isAuthenticated) {
        if (!req.session.user.role)
            res.locals.isAuth = req.session.isAuthenticated;
        else
            res.locals.isAdmin = req.session.isAuthenticated;
    }
    res.locals.csrf = req.csrfToken();
    next();
}