const {Router}= require('express');
const Products = require('../models/productsModel');
const router = Router();

router.get('/', (req, res)=>{
    res.render('addProduct', {
        title: 'Add a new product',
        isAddProduct: true
    })
})

router.post('/', async (req, res)=> {
    const products = new Products(req.body.name, req.body.price, req.body.img);

    await products.save();
    res.redirect('/products');
})

module.exports=router;