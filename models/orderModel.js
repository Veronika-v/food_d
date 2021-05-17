const {Schema, model} = require('mongoose');

const orderSchema = new Schema({
    state: {
        type: Schema.Types.ObjectId,
        ref: 'OrderState',
        required: true
    },
    products: [
        {
            product:
                {
                    type: Object,
                    required: true
                },
            count:
                {
                    type: Number,
                    required: true
                }
        }
    ],
    user:{
        name:String,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    address : {
        type: String,
        required: true
    }
});

module.exports = model('Order', orderSchema);