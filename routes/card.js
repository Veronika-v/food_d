const {Router} = require('express');
const router= Router();
const Card = require('../models/card')
const Product = require('../models/productsModel')

router.post('/add', async (req, res) =>{
    const product = await Product.getById(req.body.id);
    await Card.add(product);
    res.redirect('/card');
})

router.delete('/remove/:id', async (req, res)=>{
    const card= await Card.remove(req.params.id);
    res.status(200).json(card);
})

router.get('/', async (req, res)=>{
    const card = await Card.fetch();
    res.render('card', {
        title: 'Basket',
        isCard: true,
        products: card.products,
        price: card.price
    });

})

module.exports = router;