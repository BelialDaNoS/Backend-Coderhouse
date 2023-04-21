import express from 'express';
import fs from 'fs';
import path from 'path';
import __dirname from '../utils.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '.', 'public', 'productsmanager.html'));
});

router.post('/', (req, res) => {
  const productsPath = path.join(__dirname, '.', 'products.json');
  let products = [];

  if (fs.existsSync(productsPath)) {
    products = JSON.parse(fs.readFileSync(productsPath));
  } else {
    fs.writeFileSync(productsPath, JSON.stringify([]));
  }

  const { titulo, descripcion, codigo, precio, stock, activo, categoria } = req.body;
  if (!titulo || !descripcion || !codigo || !precio || !stock || !categoria) {
    res.status(400).send({ error: 'Faltan propiedades del producto.' });
    return;
  }


  const estado = activo === undefined ? 'inactivo' : 'activo';

  const newId = products.reduce((maxId, product) => {
    return product.id > maxId ? product.id : maxId;
  }, 0) + 1;

  const productExists = products.find((product) => product.codigo === codigo);
  if (productExists) {
    res.status(400).send({ error: 'Ya existe un producto con el mismo código.' });
    return;
  }

  const newProduct = {
    id: newId,
    titulo,
    descripcion,
    codigo,
    precio,
    stock,
    estado,
    categoria
  };
  products.push(newProduct);
  fs.writeFileSync(productsPath, JSON.stringify(products));

  res.status(200).send({ success: true, product: newProduct });
});

router.delete('/:id', (req, res) => {
  const productsPath = path.join(__dirname, '.', 'products.json');
  let products = [];

  if (fs.existsSync(productsPath)) {
    products = JSON.parse(fs.readFileSync(productsPath));
  } else {
    fs.writeFileSync(productsPath, JSON.stringify([]));
  }

  const productId = Number(req.params.id);
  const index = products.findIndex((product) => product.id === productId);

  if (index === -1) {
    res.status(404).send({ error: 'Producto no encontrado.' });
    return;
  }

  const deletedProduct = products.splice(index, 1)[0];
  fs.writeFileSync(productsPath, JSON.stringify(products));

  res.status(200).send({ success: true, product: deletedProduct });
});

router.put('/:id', (req, res) => {
  const productsPath = path.join(__dirname, '.', 'products.json');
  let products = [];
  
  if (fs.existsSync(productsPath)) {
  products = JSON.parse(fs.readFileSync(productsPath));
  } else {
  fs.writeFileSync(productsPath, JSON.stringify([]));
  }
  
  const productId = Number(req.params.id);
  const index = products.findIndex((product) => product.id === productId);
  
  if (index === -1) {
  res.status(404).send({ error: 'Producto no encontrado.' });
  return;
  }
  
  const { titulo, descripcion, codigo, precio, stock, activo } = req.body;
  
  if (!titulo || !descripcion || !codigo || !precio || !stock) {
  res.status(400).send({ error: 'Faltan propiedades del producto.' });
  return;
  }
  
  const estado = activo === undefined ? 'inactivo' : 'activo';
  
  const productExists = products.find((product) => product.codigo === codigo && product.id !== productId);
  
  if (productExists) {
  res.status(400).send({ error: 'Ya existe un producto con el mismo código.' });
  return;
  }
  
  products[index] = {
  ...products[index],
  titulo,
  descripcion,
  codigo,
  precio,
  stock,
  estado,
  };
  
  fs.writeFileSync(productsPath, JSON.stringify(products));
  
  res.status(200).send({ success: true, product: products[index] });
  });


export default router;
