const {Router} = require('express');
const router = Router();
const Order = require('../models/orderModel');
const OrderState = require('../models/orderStateModel');
const authAdmin = require('../middleware/authAdmin');


async function GetOrdersByState(req, res, orderState){
    try{
        const state= await OrderState.findOne({state: orderState});
        const orders = await Order.find({
            'state': state
        }).populate('user.userId', 'email');

        res.status(200).json(orders);
    }catch (e) {
        console.log(e);
    }
}

router.get('/', authAdmin, async (req, res) =>{
    try{
        const state= await OrderState.findOne({state: 'Active'});
        const orders = await Order.find({
            'state': state
        }).populate('user.userId', 'email');

        res.render('adminOrders', {
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
        })
    }catch (e) {
        console.log(e);
    }
})

router.get('/active', authAdmin, async (req, res) =>{
    await GetOrdersByState(req, res,'Active');
})

router.get('/passive', authAdmin, async (req, res) =>{
    await GetOrdersByState(req, res,'Passive');
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

        res.status(200).json(orders);

    } catch (e){
        console.log(e);
    }


})

module.exports = router;