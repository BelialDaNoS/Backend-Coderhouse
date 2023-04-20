import express from 'express';
import productsRouter from '../routes/products.routers.js';
import path from 'path';

// import __dirname from '../utils.js';

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/productsmanager', productsRouter);

const server = app.listen(8080, () => console.log('Listening on 8080'));


// import productsCatalogue from './routes/catalogue'
// app.use('/api/', productsCatalogue)