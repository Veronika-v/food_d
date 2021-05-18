module.exports = function (req, res, next){
    if(!req.session.isAuthenticated || !req.session.user.role){
        return res.redirect('/');
    }

    next();
}