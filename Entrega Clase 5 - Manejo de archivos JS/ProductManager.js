const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
    }
    
    async AddProduct(product) {
        try {
            await fs.access(this.path);
        } catch (error) {
            await fs.writeFile(this.path, '[]');
        }
        const content = await fs.readFile(this.path, 'utf-8')
        const products = JSON.parse(content);
        const highestId = products.reduce((highest, product) => {
        if (product.id > highest) {
            return product.id;
        }
        return highest;
        }, 0);
        product.id = highestId + 1;
        products.push(product);
        await fs.writeFile(this.path, JSON.stringify(products))
        .catch((error) => console.log(error));
      }

    async getProducts() {
        const contenido = await fs.readFile(this.path, 'utf-8')
        const products = JSON.parse(contenido);
        return products;
    }

    async getProductById(productId){
        if (!productId) {
            console.log('Product id is required');
            return;
        }
        const products = await this.getProducts();

        const chequeo = products.find(p => p.id === productId);

        if (chequeo) {
        console.log(chequeo);
        return;
        } else {
        console.log(`Id ${productId} Not found`)
        }
    }

    async updateProduct(id, updateFields) {
        if (!id) {
            console.log('Product id is required');
            return;
        }
        try {
          const content = await fs.readFile(this.path, 'utf-8');
          const products = JSON.parse(content);
      
          const index = products.findIndex((product) => product.id === id);
          if (index === -1) {
            console.log(`Product with id ${id} not found`);
            return;
          }
      
          const updatedProduct = { ...products[index], ...updateFields };
          products[index] = updatedProduct;
      
          await fs.writeFile(this.path, JSON.stringify(products));
          console.log(`Product with id ${id} updated successfully`);
        } catch (error) {
          console.log(error);
        }
    }

    async deleteProduct(id) {
        if (!id) {
            console.log('Product id is required');
            return;
        }
        const content = await fs.readFile(this.path, 'utf-8');
        const products = JSON.parse(content);
        const index = products.findIndex(product => product.id === id);
        if (index >= 0) {
          products.splice(index, 1);
          await fs.writeFile(this.path, JSON.stringify(products));
          console.log(`Product with id ${id} has been deleted.`);
        } else {
          console.log(`Product with id ${id} not found.`);
        }
      }
}

module.exports = ProductManager;