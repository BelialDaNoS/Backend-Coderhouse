class ProductManager {
  constructor() {
    this.products = [];
    this.productIdCounter = 0;
  }

  getProducts() {
    console.log(this.products);
  }


  addProduct(title, description, price, thumbnail, code, stock){

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error('Se necesita ingresar todos los campos');
      return;}

    if (this.products.some(p => p.code === code)) {
      console.error('Ya hay un producto con ese código');
      return;
    }

    const id = this.products.length+1
    const product={
      id,
      title,
      description,
      price, 
      thumbnail,
      code,
      stock
    }
    this.products.push(product);
    console.log(`Product "${title}" correctly added. ID: ${id}`)
    this.id++
  }


  getProductById(productid) {
    if (!productid) {
      console.log('Product id is required');
      return;
    }
    
    const chequeo = this.products.find(p => p.id === productid);

    if (chequeo) {
      return { chequeo };
    } else {
      console.log(`Id ${productid} Not found`)
    }
  }
}

const p = new ProductManager()

//          TESTING DE CASOS          //

// Caso 1: Todo ok

console.warn("                                CASO 1 - TODO OK")
p.getProducts()
p.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
p.addProduct("producto prueba 2", "Este es un producto prueba", 200, "Sin imagen", "321cba", 25)
p.getProducts()
p.getProductById(2)

// Caso 2: Producto incompleto, código repetido, prueba getproductbyid sin id y con id erróneo

console.warn("                                CASO 2 - TODO OKN'T")
p.addProduct("producto prueba", "Este es un producto prueba", 200, "abc123", 25) //Falta la imagen
p.addProduct("producto prueba 3", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
p.getProductById()
p.getProductById(3)