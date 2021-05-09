const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    role: {
        type: Boolean,
        required: true,
        default: 0
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    basket: {
        items:[
            {
               count:{
                   type:Number,
                   required: true,
                   default: 1
               },
               productId:{
                   type: Schema.Types.ObjectId,
                   ref: 'Product',
                   required: true
               }
            }
        ]
    }
});

module.exports = model('User', userSchema);