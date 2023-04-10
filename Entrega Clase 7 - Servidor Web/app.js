const express = require('express');
const ProductManager = require('./src/productManager');

const app = express();
const port = 8080;
const productManager = new ProductManager('./src/products.json');

app.get('/products', (req, res) => {
  const limit = req.query.limit;
  let products = productManager.getProducts();

  if (limit) {
    products = products.slice(0, limit);
  }

  res.send(products);
});

app.get('/products/:pid', (req, res) => {
  const pid = req.params.pid;
  const product = productManager.getProductById(pid);

  if (product) {
    res.send(product);
  } else {
    res.send(`Error 404. Product with id ${req.params.pid} not found`);
  }
});

app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
