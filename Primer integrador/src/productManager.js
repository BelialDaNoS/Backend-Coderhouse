const fs = require("fs");
const Product = require("./dao/models/Product");

class ProductManager {
  async addProd(prod) {
    try {
      const newProduct = new Product(prod);
      const savedProduct = await newProduct.save();
      console.log(`Producto ${savedProduct.title} agregado de manera exitosa`);
      return savedProduct;
    } catch (error) {
      console.log(error);
    }
  }
  async getProducts() {
    try {
      const productos = await Product.find();
      return productos;
    } catch (error) {
      console.log(error);
    }
  }
  async getProdById(id) {
    try {
      const producto = await Product.findById(id);
      if (!producto) {
        console.log("No existe tal producto");
        return;
      }
      return producto;
    } catch (error) {
      console.log(error);
    }
  }
  async updateProd(id, prod) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, prod, {
        new: true,
      });
      if (!updatedProduct) {
        console.log("No existe tal producto");
        return;
      }
      console.log(`Producto actualizado: ${updatedProduct}`);
      return updatedProduct;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteProdById(id) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        console.log("No existe tal producto");
        return;
      }
      console.log(`Producto eliminado: ${deletedProduct}`);
      return deletedProduct;
    } catch (error) {
      console.log(error);
    }
  }
}

const productManager = new ProductManager();

module.exports = productManager;