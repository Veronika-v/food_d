const {Router} =require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const {validationResult} = require('express-validator');
const {registerValidators, loginValidators} = require('../utils/validators');

router.get('/login', async (req,res) =>{
    res.render('auth/login', {
        title: 'Login',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
});

router.get('/logout', async (req,res) =>{
    req.session.destroy(()=>{
        res.redirect('/auth/login#login');
    });
});

router.post('/login', loginValidators, async (req, res)=>{
    try{
        const {email, password} =req.body;
        const candidate = await User.findOne({email});

        if(candidate){
            const areSame = await bcrypt.compare(password, candidate.password);
            if(areSame){
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err=>{
                    if(err)
                        throw err;
                    else
                        res.redirect('/');
                })
            }
            else{
                req.flash('loginError', 'Password is wrong');
                res.redirect('/auth/login#login');
            }
        }
        else{
            req.flash('loginError', 'User does not exist');
            res.redirect('/auth/login#login');
        }

    }catch (e){
        console.log(e);
    }
})

router.post('/register',  registerValidators, async (req, res)=>{
    try{
        const {email, password, name}= req.body;

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            req.flash('registerError', errors.array()[0].msg);
            return res.status(422).redirect('/auth/login#register');
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email, name, password: hashPassword, basket: {items: []}
        });
        await user.save();
        res.redirect('/auth/login#login');
    }catch (e) {
        console.log(e);
    }
})

module.exports = router;