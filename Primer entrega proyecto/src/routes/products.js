import express from 'express';
import path from 'path';
import  __dirname  from '../utils.js';
import fs from 'fs';

const router = express.Router();

router.get('/', (req, res) => {
  const filePath = path.join(__dirname, './index.html');
  res.sendFile(filePath);
});


router.get('/catalogue', (req, res) => {
    const filePath = path.join(__dirname, '../products.json');
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
      } else {
        const products = JSON.parse(data);
        res.json(products);
      }
    });
});


router.get('/catalogue/:id', (req, res) => {
    const filePath = path.join(__dirname, '../products.json');
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
      } else {
        const products = JSON.parse(data);
        const id = parseInt(req.params.id); // Convertir el parámetro :id a un número
        const product = products.find(p => p.id === id);
        if (product) {
          res.json(product);
        } else {
          res.status(404).send('Producto no encontrado');
        }
      }
    });
});
  


export default router;
