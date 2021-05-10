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
    name: String,
    password: {
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

userSchema.methods.addToBasket = function (product){
    const items= [...this.basket.items];
    const idx = items.findIndex(p=>{
       return  p.productId.toString() === product._id.toString();
    });

    if(idx >=0){ // уже есть такой продукт
        items[idx].count = items[idx].count + 1;
    }else{ //такого продукта еще нет в массиве, добавляю
        items.push({
            productId: product._id,
            count: 1
        })
    };

    this.basket = { items: items}; //this.basket = {items};
    return this.save();
}

userSchema.methods.removeFromBasket = function (id){
    let items= [...this.basket.items];
    const idx = items.findIndex( p =>{
        return p.productId.toString() === id.toString();
    })

    if(items[idx].count===1){
        items = items.filter(p => p.productId.toString() !== id.toString());
    }else{
        items[idx].count--;
    }

    this.basket= {items};
    return this.save();
}

userSchema.methods.clearBasket = function (){
    this.basket = {items: []};
    return this.save();
}

module.exports = model('User', userSchema);