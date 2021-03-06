const {Router}= require('express');
const {validationResult} = require('express-validator');
const Product = require('../models/productModel');
const router = Router();
const authAdmin = require('../middleware/authAdmin');
const {productsValidators} =require('../utils/validators');

router.get('/', authAdmin, (req, res)=>{

    res.render('addProduct', {
        title: 'Add a new product',
        isAddProduct: true
    })
})

router.post('/', authAdmin, productsValidators, async (req, res)=> {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).render('addProduct', {
            title: 'Add a new product',
            isAddProduct: true,
            error: errors.array()[0].msg,
            data: {
                name: req.body.name,
                price: req.body.price,
                img: req.body.img,
                description: req.body.description
            }
        })
    }

    const product = new Product({
       name: req.body.name,
       price: req.body.price,
       img: req.body.img,
       description: req.body.description,
       //userId: req.user
    });

    try {
        await product.save();
        res.redirect('/products');
    } catch (err){
        console.log(err);
    }




})

module.exports=router;