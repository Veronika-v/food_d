const {Router}= require('express');
const Product = require('../models/productModel');
const {validationResult} = require('express-validator');
const router = Router();
const auth = require('../middleware/auth');
const {productsValidators} = require('../utils/validators');

router.get('/', async (req, res)=>{
    const products = await Product.find();
    res.render('products', {
        title: 'List of products',
        isProducts: true,
        products
    });
})

router.post('/remove', auth, async (req,res)=>{
    try{
        await Product.deleteOne({_id: req.body.id});
        res.redirect('/products');
    }
    catch (e){
        console.log(e);
    }

})

router.get('/:id/edit', auth, async (req, res)=>{
    if(!req.query.allow){
        return res.redirect('/')
    }
    const product = await Product.findById(req.params.id);

    res.render('productEdit', {
        title: `Edit ${product.name}` ,
        product
    })
})

router.post('/edit', auth, productsValidators,  async (req, res)=>{
    const errors = validationResult(req);
    const {id}= req.body;

    if(!errors.isEmpty()){
        return res.status(422).redirect(`/products/${id}/edit?allow=true`);
    }

    delete req.body.id;
    await Product.findByIdAndUpdate(id, req.body);
    res.redirect('/products');
})

/*router.get('/:id', async(req, res)=>{
    const product = await Product.findById(req.params.id)
    res.render('product', {
        layout: 'empty',
        title: `Product ${product.name}`,
        product
    });
})*/

module.exports=router;