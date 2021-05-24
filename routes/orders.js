const {Router} = require('express');
const router = Router();
const {validationResult} = require('express-validator');
const Order = require('../models/orderModel');
const OrderState = require('../models/orderStateModel');
const auth = require('../middleware/auth');
const {addressValidators} = require('../utils/validators');


function mapBasketItems(basket){
    return basket.items.map( p => ({
        ...p.productId._doc,
        id: p.productId.id,
        count: p.count
    }))
}

async function GetOrdersByState(req, res, orderState){
    try{
        const state= await OrderState.findOne({state: orderState});
        const orders = await Order.find({
            'state': state, 'user.userId': req.user._id
        }).populate('user.userId', 'email');

        /*res.render('orders', {
            isAdminOrder: true,
            title: 'Orders',
            orders: orders.map( o=>{
                return {
                    ...o._doc,
                    price: o.products.reduce((total, p)=>{
                        return total += p.count * p.product.price
                    }, 0)
                }
            })
        })*/
        res.status(200).json(orders);
    }catch (e) {
        console.log(e);
    }
}

function calculateTotalPrice(products){
    return products.reduce((total, product)=>{
        return total += product.price * product.count;
    }, 0);// по умолч price=0
}

router.get('/', auth, async (req, res) =>{

    try{
        const state= await OrderState.findOne({state: 'Active'});
        const orders = await Order.find({
            'state': state, 'user.userId': req.user._id
        }).populate('user.userId');

        res.render('orders', {
            isOrder: true,
            title: 'Orders',
            orders: orders.map( o=>{
                return {
                    ...o._doc,
                    price: o.products.reduce((total, p)=>{
                        return total += p.count * p.product.price
                    }, 0)
                }
            })
        })
    }catch (e) {
        console.log(e);
    }
})

router.get('/active', auth, async (req, res) =>{
    await GetOrdersByState(req, res,'Active');
})

router.get('/passive', auth, async (req, res) =>{
    await GetOrdersByState(req, res,'Passive');
})

router.post('/', auth, addressValidators, async (req, res) =>{

    const errors = validationResult(req);

    const user = await req.user
        .populate('basket.items.productId')
        .execPopulate();

    const products = mapBasketItems(user.basket);

    if(!errors.isEmpty()) {
        return res.status(422).render('basket', {
            title: 'Basket',
            isCard: true,
            error: errors.array()[0].msg,
            products: products,
            price: calculateTotalPrice(products)
        });
    }

        try {
            const user = await req.user
                .populate('basket.items.productId')
                .execPopulate();

            const products = user.basket.items.map(i => ({
                count: i.count,
                product: {...i.productId._doc}
            }))

            const state = await OrderState.findOne({state: 'Active'});

            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products,
                state: state,
                address: req.body.address
            })

            await order.save();
            await req.user.clearBasket();

            res.redirect('/orders');
        } catch (e) {
            console.log(e);
        }

})

module.exports = router;