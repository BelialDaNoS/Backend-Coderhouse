import express from 'express';
import products from './routes/products.js'
import cart from './routes/cart.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', products)

app.use('/api/cart', cart)

const server = app.listen(8080, () => console.log('Listening on 8080'));