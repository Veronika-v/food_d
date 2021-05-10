const express =require('express');
const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const homeRoutes = require('./routes/home');
const productsRoutes = require('./routes/products');
const addProductRoutes = require('./routes/addProduct');
const cardRoutes = require('./routes/basket');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');


const PORT = process.env.PORT || 3000;
const app =express();


const hbs= exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

const MONGODB_URI = 'mongodb+srv://veronika:XkX5yolkx19lEWTq@cluster0.ic3ox.mongodb.net/FoodDelivery';
const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);



app.use('/', homeRoutes);
app.use('/products', productsRoutes);
app.use('/addProduct', addProductRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);



async function start(){
    try {

        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

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


