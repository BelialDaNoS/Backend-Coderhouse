import express from 'express';
import path from 'path';
import  __dirname  from '../utils.js';
import fs from 'fs';

const router = express.Router();

router.get('/', (req, res) => {
  const productfile = path.join(__dirname, './products.json');
  const limit = parseInt(req.query.limit);

  if (!fs.existsSync(productfile)) {
    fs.writeFileSync(productfile, '[]');
  }
  fs.readFile(productfile, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }
    let products = JSON.parse(data);
    if (limit && !isNaN(limit)) {
      products = products.slice(0, limit);
    }
    res.send(products);
  });
});


router.get('/:pid', (req, res) => {
    const filePath = path.join(__dirname, './products.json');
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal server error');
      } else {
        const products = JSON.parse(data);
        const id = parseInt(req.params.pid);
        const product = products.find(p => p.id === id);
        if (product) {
          res.json(product);
        } else {
          res.status(404).send('Product not found');
        }
      }
    });
});

router.post('/', (req, res) => {
  const productsPath = path.join(__dirname, '.', 'products.json');
  let products = [];

  if (fs.existsSync(productsPath)) {
    products = JSON.parse(fs.readFileSync(productsPath));
  } else {
    fs.writeFileSync(productsPath, JSON.stringify([]));
  }

  const { title, description, code, price, stock, status, category, thumbnails } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    res.status(400).send({ error: 'Please complete all the properties.' });
    return;
  }
  const checkstatus = status == undefined || status == 1 ? 'Active' : 'Inactive';

  const newId = products.reduce((maxId, product) => {
    return product.id > maxId ? product.id : maxId;
  }, 0) + 1;
  const productExists = products.find((product) => product.code === code);
  if (productExists) {
    res.status(400).send({ error: 'Code already in use.' });
    return;
  }
  const imagePath = thumbnails == !undefined || thumbnails !== "" ? `../images/${thumbnails}` : "No image"

  const newProduct = {
    id: newId,
    title,
    description,
    code,
    price,
    stock,
    status : checkstatus,
    category,
    thumbnails : imagePath
  };

  products.push(newProduct);
  fs.writeFileSync(productsPath, JSON.stringify(products));

  res.status(200).send({ Estado: `Product correctly uploaded with ID: ${newId}`, product: newProduct });
});

router.delete('/:pid', (req, res) => {
  const productsPath = path.join(__dirname, '.', 'products.json');
  let products = [];

  if (fs.existsSync(productsPath)) {
    products = JSON.parse(fs.readFileSync(productsPath));
  } else {
    fs.writeFileSync(productsPath, JSON.stringify([]));
  }

  const productId = Number(req.params.pid);
  const index = products.findIndex((product) => product.id === productId);

  if (index === -1) {
    res.status(404).send({ error: 'Product not found.' });
    return;
  }

  const deletedProduct = products.splice(index, 1)[0];
  fs.writeFileSync(productsPath, JSON.stringify(products));

  res.status(200).send({ Estado: 'Correctly Deleted', product: deletedProduct });
});

router.put('/:pid', (req, res) => {
  const productsPath = path.join(__dirname, '.', 'products.json');
  let products = [];

  if (fs.existsSync(productsPath)) {
    products = JSON.parse(fs.readFileSync(productsPath));
  } else {
    fs.writeFileSync(productsPath, JSON.stringify([]));
  }

  const { title, description, code, price, stock, status, thumbnails, category } = req.body;

  const updateid =  Number(req.params.pid);
  

  const existingProductIndex = products.findIndex((product) => product.id === updateid);
  if (existingProductIndex === -1) {
    res.status(400).send({ error: `No product found with id ${updateid}.` });
    return;
  }

  const existingProduct = products[existingProductIndex];

  const imagePath = thumbnails !== "" ? `../images/${thumbnails}` : existingProduct.thumbnails

  
  const checkstatus = status == undefined || status == 1 ? 'Active' : 'Inactive';


  const updatedProduct = {
    ...existingProduct,
    title: title !== '' ? title : existingProduct.title,
    description: description !== '' ? description : existingProduct.description,
    code: code !== '' ? code : existingProduct.code,
    price: price !== '' ? price : existingProduct.price,
    stock: stock !== '' ? stock : existingProduct.stock,
    status: status !== '' ? checkstatus : existingProduct.status,
    thumbnails: imagePath,
    category : category !== '' ? category : existingProduct.category
  };
  products[existingProductIndex] = updatedProduct;
  fs.writeFileSync(productsPath, JSON.stringify(products));

  res.status(200).send({ success: "Product updated", product: updatedProduct });
});

export default router;
