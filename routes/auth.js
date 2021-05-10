const {Router} =require('express');
const router = Router();
const User = require('../models/userModel');

router.get('/login', async (req,res) =>{
    res.render('auth/login', {
        title: 'Login',
        isLogin: true
    })
});

router.get('/logout', async (req,res) =>{
    req.session.destroy(()=>{
        res.redirect('/auth/login#login');
    });
});

router.post('/login', async (req, res)=>{
    const user = await User.findById('60984e2b3dfa592654098817');
    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save(err=>{
        if(err)
            throw err;
        else
            res.redirect('/');
    })
})

module.exports = router;