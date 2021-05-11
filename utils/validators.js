const {body} = require('express-validator');
const User = require('../models/userModel');


exports.registerValidators =[
    body('email')
        .isEmail().withMessage('Enter the valid e-mail')
        .custom(async (value, {req})=>{
        try{
            const user = await User.findOne({email: value})
            if(user){
                return Promise.reject('Email has already used')
            }
        }catch (e) {
            console.log(e);
        }
    })
        .normalizeEmail(),

    body('password', 'Password should be between 5 and 25 and do not contain special symbols')
        .isLength({min: 5, max:25})
        .isAlphanumeric()
        .trim(),

    body('confirm')
        .custom((value, {req})=>{
        if(value != req.body.password){
            throw new Error('Passwords should match');
        }
        return true;
    })
        .trim(),

    body('name', 'Name should be between 2 and 50 characters')
        .isLength({min:2, max:50})
        .isAlpha()
        .trim()
]



exports.loginValidators = [
    body('email')
        .isEmail().withMessage('Enter the valid e-mail')
        .custom(async (value, {req})=>{
            try{
                const user = await User.findOne({email: value})
                if(!user){
                    return Promise.reject('User with that email does not exist')
                }
            }catch (e) {
                console.log(e);
            }
        })
        .normalizeEmail(),

    body('password', 'Password has a wrong format')
        .isLength({min: 5, max:25})
        .isAlphanumeric()
        .trim()
]


exports.productsValidators = [

]