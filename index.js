const express =require('express');
const path = require('path');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const compression = require('compression');
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
const adminOrdersRoutes = require('./routes/adminOrders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorHandler = require('./middleware/error');
const fileMiddleware = require('./middleware/file');
const keys = require('./keys/indexKeys');
const http = require("http");

const PORT = process.env.PORT || 3000;

const app =express();
const server = http.createServer(app);
const io = socketIO(server);


const hbs= exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})


const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

//app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use((req, res, next)=>{
    req.io= io;
    next();
})



io.on('connection', socket => {
    console.log('connected:'+ socket.id);

    socket.on('done', name => {
        socket.broadcast.emit('productDone', name)
    })

})

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(fileMiddleware.single('avatar'));
app.use(csrf());
app.use(flash());
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);



app.use('/', homeRoutes);
app.use('/products', productsRoutes);
app.use('/addProduct', addProductRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/adminOrders', adminOrdersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(errorHandler);


async function start(){
    try {

        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch(err){
        console.log(err);
    }
}

start();



