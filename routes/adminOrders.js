const {Router} = require('express');
const router = Router();
const Order = require('../models/orderModel');
const OrderState = require('../models/orderStateModel');
const authAdmin = require('../middleware/authAdmin');
const mongoose = require('mongoose');

/*function mapOrderItems(orders){
    return orders.items.map( o => ({
        ...o._doc,
        price: o.products.reduce((total, p)=>{
            return total += p.count * p.product.price
        }, 0)
    }))
}*/

router.get('/', authAdmin, async (req, res) =>{
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

router.post('/', authAdmin, async (req, res) =>{

    try{
        const {id}= req.body;

        const stateP= await OrderState.findOne({state: 'Passive'});
        await Order.findByIdAndUpdate(id, {$set: { state: stateP}});

        const stateA= await OrderState.findOne({state: 'Active'});
        const orders = await Order.find({
            'state': stateA
        }).populate('user.userId', 'email');

        //res.redirect('/adminOrders');
        res.status(200).json(orders);

    } catch (e){
        console.log(e);
    }

})

module.exports = router;