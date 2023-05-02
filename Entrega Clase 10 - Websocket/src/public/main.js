const socket=io()
let productos=[]

const updateProductos=(data)=>{
    productosToHtml=''
    data.forEach(i=>{
        productosToHtml=productosToHtml+`<tr><td>${i.title}</td><td>${i.price}</td><td>${i.id}</td></tr>`
    });
    document.querySelector(".tableBody").innerHTML=productosToHtml
  }
  socket.on('UPDATE_DATA',data=>{
    const productos=data.productos
    console.log(productos)
    updateProductos(productos)
  })

  const sendNewProd=()=>{
    const title=document.querySelector('#title').value
    const description=document.querySelector('#description').value
    const code=document.querySelector('#code').value
    const price=document.querySelector('#price').value
    const stock=document.querySelector('#stock').value
    const thumbnail=document.querySelector('#thumbnail').value
    if(!title||!description||!code||!price||!stock||!thumbnail){
        alert('faltan datos')
        return
    }
    const nuevoProducto={title,description, code, price, stock, thumbnail }
    console.log(nuevoProducto)
    socket.emit('NEW_PRODUCT_TO_SERVER',nuevoProducto)
    document.querySelector('#title').value=''
    document.querySelector('#description').value=''
    document.querySelector('#code').value=''
    document.querySelector('#price').value=''
    document.querySelector('#stock').value=''
    document.querySelector('#thumbnail').value=''

    Swal.fire({
      title: '¡Producto agregado correctamente!',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });    
  }
  socket.on('NEW_PRODUCTS_FROM_SERVER',data=>{
    updateProductos(data)
})

const deleteProd=()=>{
  const id=document.querySelector('#id').value
  console.log(id)
  socket.emit('PRODUCT_TO_DELETE',id)
  document.querySelector('#id').value=''    
}

socket.on('UPDATED_PRODUCTS_FROM_SERVER',data=>{
  console.log(productos)
  console.log(data)
  updateProductos(data)

})