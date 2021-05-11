const {Router}= require('express');
const {validationResult} = require('express-validator');
const Product = require('../models/productModel');
const router = Router();
const auth = require('../middleware/auth');
const {productsValidators} =require('../utils/validators');

router.get('/', auth, (req, res)=>{
    res.render('addProduct', {
        title: 'Add a new product',
        isAddProduct: true
    })
})

router.post('/', auth, productsValidators, async (req, res)=> {


    const product = new Product({
       name: req.body.name,
       price: req.body.price,
       img: req.body.img,
       userId: req.user
    });

    try {
        await product.save();
        res.redirect('/products');
    } catch (err){
        console.log(err);
    }

})

module.exports=router;