import express from 'express';
import path from 'path';
import fs from 'fs';
import  __dirname  from '../utils.js';
import { v4 as uuidv4 } from 'uuid'; 

const router = express.Router();
const cartsFilePath = path.join(__dirname, './carts.json');
const productsFilePath = path.join(__dirname, './products.json');

router.get('/', (req, res) => {

    if (!fs.existsSync(cartsFilePath)) {
        fs.writeFileSync(cartsFilePath, '[]');
      }
    const filePath = path.join(__dirname, './cart.html');
    res.sendFile(filePath);
});

router.get('/total', (req, res) => {
    const filePath = path.join(__dirname, './carts.json');
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

router.post('/', (req, res) => {

// Verificar si existe el archivo de carritos y crearlo si no existe
if (!fs.existsSync(cartsFilePath)) {
  fs.writeFileSync(cartsFilePath, JSON.stringify([]));
}

const cartproducts = [];

// Agregar el producto recibido al array de productos
const newProduct = req.body;

newProduct.precio = parseFloat(newProduct.precio);
newProduct.id = parseInt(newProduct.id);
newProduct.Quantity = parseInt(newProduct.Quantity)

cartproducts.push(newProduct);

// Leer el archivo de carritos
const carts = JSON.parse(fs.readFileSync(cartsFilePath));

// Obtener el último código de carrito y sumarle 1 para generar un nuevo código único
const lastCart = carts[carts.length - 1];
const cartcode = lastCart ? lastCart.cartcode + 1 : 1;

// Crear un nuevo objeto de carrito con el producto agregado y el código generado
const cart = {
  cartcode,
  cartproducts: [newProduct]
};

// Agregar el carrito al array de carritos
carts.push(cart);

// Guardar el archivo de carritos
fs.writeFileSync(cartsFilePath, JSON.stringify(carts));

// Devolver la respuesta con el carrito creado y el código de carrito generado
res.json({
  cartcode,
  cartproducts: [newProduct]
});

});



router.post('/:cartcode/product/:pid', (req, res) => {
  const { cartcode, pid } = req.params;

  const cartsData = fs.readFileSync(cartsFilePath);
  const carts = JSON.parse(cartsData);

  const cartIndex = carts.findIndex((cart) => cart.cartcode === parseInt(cartcode));

  if (cartIndex === -1) {
    res.status(404).json({ message: `El carrito con código ${cartcode} no existe.` });
    return;
  }

  const productsData = fs.readFileSync(productsFilePath);
  const products = JSON.parse(productsData);

  const productIndex = products.findIndex((product) => product.id === parseInt(pid));

  if (productIndex === -1) {
    res.status(404).json({ message: `El producto con ID ${pid} no existe.` });
    return;
  }

  const existingProductIndex = carts[cartIndex].cartproducts.findIndex((product) => product.id === parseInt(pid));

  if (existingProductIndex !== -1) {
    carts[cartIndex].cartproducts[existingProductIndex].Quantity += 1;
  } else {
    carts[cartIndex].cartproducts.push({
      ...products[productIndex],
      Quantity: 1
    });
  }

  fs.writeFileSync(cartsFilePath, JSON.stringify(carts));

  res.status(200).json({ message: `El producto con ID ${pid} fue agregado al carrito con código ${cartcode}.` });
});


export default router;
