const {Router} = require('express');
const router= Router();
const Product = require('../models/productModel');

function mapBasketItems(basket){
    return basket.items.map( p => ({
        ...p.productId._doc,
        id: p.productId.id,
        count: p.count
    }))
};

function calculateTotalPrice(products){
    return products.reduce((total, product)=>{
        return total += product.price * product.count;
    }, 0);// по умолч price=0
}

router.post('/add', async (req, res) =>{
    const product = await Product.findById(req.body.id);
    await req.user.addToBasket(product);
    res.redirect('/card');
})

router.delete('/remove/:id', async (req, res)=>{
    await req.user.removeFromBasket(req.params.id);
    const user = await req.user.populate('basket.items.productId').execPopulate();

    const products = mapBasketItems(user.basket);
    const basket = {
        products,
        price: calculateTotalPrice(products)
    }

    res.status(200).json(basket);
})

router.get('/', async (req, res)=>{
    const user = await req.user
        .populate('basket.items.productId')
        .execPopulate();

    const products = mapBasketItems(user.basket);

    //console.log(JSON.stringify(products));
    res.render('basket', {
        title: 'Basket',
        isCard: true,
        products: products,
        price: calculateTotalPrice(products)
    });

})

module.exports = router;