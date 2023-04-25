import express from 'express';
import path from 'path';
import fs from 'fs';
import  __dirname  from '../utils.js';

const router = express.Router();
const cartsFilePath = path.join(__dirname, './carts.json');
const productsFilePath = path.join(__dirname, './products.json');

router.get('/:cid', (req, res) => {

  if (!fs.existsSync(cartsFilePath)) {
      fs.writeFileSync(cartsFilePath, '[]');
    }
    const carts = JSON.parse(fs.readFileSync(cartsFilePath));
    const cartId = parseInt(req.params.cid);
  
    const cart = carts.find(c => c.id === cartId);
  
    if (!cart) {
      res.status(404).json({ error: `Cart with ID ${cartId} not found` });
    } else {
      res.json(cart.products);
    }
});

router.post('/', (req, res) => {

  if (!fs.existsSync(cartsFilePath)) {
    fs.writeFileSync(cartsFilePath, JSON.stringify([]));
  }

  const carts = JSON.parse(fs.readFileSync(cartsFilePath));

  const lastId = carts.length > 0 ? carts.reduce((maxId, cart) => {
    return cart.id > maxId ? cart.id : maxId;
  }, 0) : 0;

  const newCart = {
    id: lastId + 1,
    products: []
  };

  carts.push(newCart);

  fs.writeFileSync(cartsFilePath, JSON.stringify(carts));

  res.status(201).json(newCart);
  
});

router.post('/:cid/product/:pid', (req, res) => {
  const carts = JSON.parse(fs.readFileSync(cartsFilePath));
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const quantity = parseInt(req.body.quantity);

  const cartIndex = carts.findIndex(c => c.id === cartId);

  if (cartIndex === -1) {
    res.status(404).json({ error: `Cart with ID ${cartId} not found` });
  } else {
    const products = JSON.parse(fs.readFileSync(productsFilePath));
    const product = products.find(p => p.id === productId);

    if (!product) {
      res.status(404).json({ error: `Product with ID ${productId} not found` });
    } else {
      const productIndex = carts[cartIndex].products.findIndex(p => p.product === productId);

      if (productIndex === -1) {

        carts[cartIndex].products.push({
          product: productId,
          quantity: quantity || 1 
        });
      } else {
        carts[cartIndex].products[productIndex].quantity += quantity || 1;
      }

      fs.writeFileSync(cartsFilePath, JSON.stringify(carts));

      res.status(201).json({ message: 'Product added to cart' });
    }
  }
});

export default router;
