module.exports = function (req, res, next){
    res.status(404).render('404', {
        status: '404',
        title: 'Not Found'
    })
}