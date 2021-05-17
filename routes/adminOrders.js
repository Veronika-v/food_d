const {Router} = require('express');
const router = Router();
const Order = require('../models/orderModel');
const OrderState = require('../models/orderStateModel');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

/*function mapOrderItems(orders){
    return orders.items.map( o => ({
        ...o._doc,
        price: o.products.reduce((total, p)=>{
            return total += p.count * p.product.price
        }, 0)
    }))
}*/

router.get('/', auth, async (req, res) =>{
    try{
        const state= await OrderState.findOne({state: 'Active'});
        const orders = await Order.find({
            'state': state
        }).populate('user.userId', 'email');

        res.render('adminOrders', {
            isAdminOrder: true,
            title: 'All orders',
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
        const {id}= req.body;
        //console.log(JSON.stringify(req.body));

        const state= await OrderState.findOne({state: 'Passive'});

        await Order.findByIdAndUpdate(id, {$set: { state: state}});

        res.redirect('/adminOrders');

    } catch (e){
        console.log(e);
    }

})

module.exports = router;