const ProductManager = require('./ProductManager');
const path = './Products.json';

const manager = new ProductManager(path);

async function Addproduct() {

  const newProduct = {
    Title: 'Martillo',
    Description: 'Martillo',
    Price: 500,
    Thumnail: 'No image',
    Stock: 10
    };

    await manager.AddProduct(newProduct);
    console.log(`Product "${newProduct.Title}" has been correctly added`);
}

async function Catalogue(){
    console.log(await manager.getProducts())
    
}

async function Delete(id){
    await manager.deleteProduct(id);
}

async function GetProductById(id){
   await manager.getProductById(id);
}




async function ProductToUpdate(id){
    const updatedProduct ={
        Title :'Destornillador Philips',
        Stock : 5
    }
    await manager.updateProduct(id, updatedProduct);
}


Addproduct()

Catalogue()

GetProductById(3)

ProductToUpdate()

Delete(1)