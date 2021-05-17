module.exports = function (req, res, next){
    res.status(404).render('error', {
        status: '404',
        title: 'Not Found'
    })
}