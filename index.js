const express =require('express');
const path = require('path');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const productsRoutes = require('./routes/products');
const addProductRoutes = require('./routes/addProduct');
const cardRoutes = require('./routes/basket');
const User =require('./models/userModel');
const ordersRoutes = require('./routes/orders');

const PORT = process.env.PORT || 3000;
const app =express();


const hbs= exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next)=>{
    try {
        const user = await User.findById('60984e2b3dfa592654098817');
        req.user = user;
        next();
    }catch (e){
        console.log(e);
    }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use('/', homeRoutes);
app.use('/products', productsRoutes);
app.use('/addProduct', addProductRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);

async function start(){
    try {
        const url = 'mongodb+srv://veronika:XkX5yolkx19lEWTq@cluster0.ic3ox.mongodb.net/FoodDelivery';
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        const candidate = await User.findOne();
        if(!candidate){
            const user = new User ({
                email: 'comedi.nika@mail.ru',
                name: 'Veronika',
                basket: {items: []}
            })
            await user.save();
        }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch(err){
        console.log(err);
    }
}

start();

//const password ='XkX5yolkx19lEWTq';


