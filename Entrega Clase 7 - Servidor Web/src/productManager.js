const fs = require('fs');

class ProductManager {
  constructor(filename) {
    this.filename = filename;
    this.products = [];

    try {
      const data = fs.readFileSync(this.filename, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.log(`Error reading file ${this.filename}: ${error}`);
    }
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  addProduct(product) {
    product.id = this.products.length.toString();
    this.products.push(product);
    this.save();
  }

  deleteProduct(id) {
    this.products = this.products.filter((product) => product.id !== id);
    this.save();
  }

  save() {
    try {
      fs.writeFileSync(this.filename, JSON.stringify(this.products));
    } catch (error) {
      console.log(`Error writing file ${this.filename}: ${error}`);
    }
  }
}

module.exports = ProductManager;
