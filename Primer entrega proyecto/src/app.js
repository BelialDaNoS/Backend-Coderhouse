import express from 'express';
// import productsRouter from './routes/productmanager.js';
import products from './routes/products.js'
import cart from './routes/cart.js'
import path from 'path';
// import __dirname from './utils.js';

const app = express();
// const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, '.', 'public')));
app.use('/api/products', products)
// app.use('/api/productsmanager', productsRouter);
app.use('/api/cart', cart)

const server = app.listen(8080, () => console.log('Listening on 8080'));