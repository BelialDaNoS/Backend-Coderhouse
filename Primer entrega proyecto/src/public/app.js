import express from 'express';
import productsRouter from '../routes/productmanager.js';
import products from '../routes/products.js'
import path from 'path';

// import __dirname from '../utils.js';

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api/cat', products)
app.use('/api/productsmanager', productsRouter);

const server = app.listen(8080, () => console.log('Listening on 8080'));


