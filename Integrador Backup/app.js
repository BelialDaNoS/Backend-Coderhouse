const express=require('express')
require('dotenv').config()
const productManager=require('./src/productManager')
const { create }=require('express-handlebars')
const app=express()
const indexRouter=require('./src//routes/indexRouter')
app.use('/',express.static(__dirname+'/src/public'))


const {Server:IoServer}=require('socket.io')
const {Server:HttpServer}=require('http')
const http=new HttpServer(app)
const io=new IoServer(http)

const hbs=create({
    extname:'.hbs'
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))

io.on('connection',async(socket)=>{
    console.log(`nuevo cliente ${socket.id} conectado`)
    const productos=await productManager.getProducts()
    socket.emit('UPDATE_DATA',{productos})
    socket.on('PRODUCT_TO_DELETE',async(data)=>{
        await productManager.deleteProdById(parseInt(data))
        const productosActualizados=await productManager.getProducts()
        console.log(productosActualizados)
        io.sockets.emit('UPDATED_PRODUCTS_FROM_SERVER',productosActualizados)
    })
  
    socket.on('NEW_PRODUCT_TO_SERVER',async(data)=>{
        
        const nuevosproductos=await productManager.addProd(data)
        console.log(nuevosproductos)
        // const nuevosProductos=await productManager.getProducts()
        io.sockets.emit('NEW_PRODUCTS_FROM_SERVER',nuevosproductos)
    })
})

app.engine('hbs',hbs.engine)
app.set('views','./views');
app.set('view engine','hbs')

app.use(indexRouter)
module.exports=http