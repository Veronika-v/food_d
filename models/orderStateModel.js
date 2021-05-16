const {Schema, model} = require('mongoose');

const orderStateSchema = new Schema({
    state: {
        type: String
    }
});

module.exports = model('OrderState', orderStateSchema);