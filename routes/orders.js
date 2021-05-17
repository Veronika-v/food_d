const {Router} = require('express');
const router = Router();
const Order = require('../models/orderModel');
const OrderState = require('../models/orderStateModel');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) =>{
    try{
        const orders = await Order.find({
            'user.userId': req.user._id
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

router.post('/', auth, async (req, res) =>{

    try{
        const user = await req.user
            .populate('basket.items.productId')
            .execPopulate();

        const products = user.basket.items.map( i =>({
            count: i.count,
            product: {...i.productId._doc}
        }))

        const state= await OrderState.findOne({state: 'Active'});

        const order= new Order({
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
    } catch (e){
        console.log(e);
    }

})

module.exports = router;