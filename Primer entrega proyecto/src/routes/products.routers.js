import express from 'express';
import fs from 'fs';
import path from 'path';
import __dirname from '../utils.js';


const router = express.Router();






router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '.', 'public', 'products.html'));
});


// Endpoint POST para agregar un nuevo producto
router.post('/', (req, res) => {
  const productsPath = path.join(__dirname, '..', 'products.json');
  let products = [];

  // Verificar si existe el archivo products.json
  if (fs.existsSync(productsPath)) {
    products = JSON.parse(fs.readFileSync(productsPath));
  } else {
    fs.writeFileSync(productsPath, JSON.stringify([]));
  }

  // Verificar que el objeto tenga todas las propiedades necesarias
  const { titulo, descripcion, codigo, precio, stock, activo } = req.body;
  if (!titulo || !descripcion || !codigo || !precio || !stock) {
    res.status(400).send({ error: 'Faltan propiedades del producto.' });
    return;
  }

  // Verificar si activo es undefined, asignar "inactivo" en caso contrario
  const estado = activo === undefined ? 'inactivo' : 'activo';

  // Asignar ID al nuevo producto
  const newId = products.reduce((maxId, product) => {
    return product.id > maxId ? product.id : maxId;
  }, 0) + 1;

  // Verificar si ya existe un producto con el mismo código
  const productExists = products.find((product) => product.codigo === codigo);
  if (productExists) {
    res.status(400).send({ error: 'Ya existe un producto con el mismo código.' });
    return;
  }

  // Agregar el nuevo producto al array de productos y guardarlo en el archivo
  const newProduct = {
    id: newId,
    titulo,
    descripcion,
    codigo,
    precio,
    stock,
    estado,
  };
  products.push(newProduct);
  fs.writeFileSync(productsPath, JSON.stringify(products));

  // Devolver el estado de éxito y el nuevo producto agregado
  res.status(200).send({ success: true, product: newProduct });
});


// router.put('/', (req, res) => {
//   const product = req.body;


//   const requiredFields = ['titulo', 'descripcion', 'codigo', 'precio', 'stock', 'categoria'];
//   const missingFields = requiredFields.filter(field => !(field in product));

//   if (missingFields.length > 0) {
//     return res.status(400).send(`Faltan los siguientes campos: ${missingFields.join(', ')}`);
//   }


//   const existingProductIndex = products.findIndex(p => p.codigo === product.codigo);

//   if (existingProductIndex === -1) {

//     return res.status(404).send(`No existe un producto con el código ${product.codigo}`);
//   }

//   products[existingProductIndex] = {
//     ...products[existingProductIndex],
//     titulo: product.titulo,
//     descripcion: product.descripcion,
//     precio: product.precio,
//     stock: product.stock,
//     activo: product.activo === 'on' ? 'Activo' : 'Inactivo',
//     categoria: product.categoria
//   };

//   fs.writeFile(PRODUCTS_FILE, JSON.stringify(products), err => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error al guardar el producto');
//     }

//     products = [];

//     return res.send('Producto actualizado correctamente');
//   });
// });

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
    } else {
      let products = JSON.parse(data);

      const index = products.findIndex((product) => product.id === parseInt(id));

      if (index !== -1) {
        products.splice(index, 1);

        fs.writeFile(PRODUCTS_FILE, JSON.stringify(products), 'utf8', (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error interno del servidor');
          } else {
            res.status(200).send('Objeto borrado exitosamente');
          }
        });
      } else {
        res.status(404).send('ID inexistente');
      }
    }
  });
});
export default router;
