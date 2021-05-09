const {Router}= require('express');
const Product = require('../models/productsModel');
const router = Router();

router.get('/', (req, res)=>{
    res.render('addProduct', {
        title: 'Add a new product',
        isAddProduct: true
    })
})

router.post('/', async (req, res)=> {
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