const express = require('express');
const router = express.Router();
const productManager = require('../../productManager');
const Product = require('../../dao/models/Product');

router.get('/',async(_req,res)=>{
    const productos=await productManager.getProducts()
    res.render('home',{productos:productos})

})
router.get('/realtimeproducts',(_req,res)=>{
    res.render('realtime')
})
router.post('/realtimeproducts',(req,res)=>{
    const {prueba}=req.body
    console.log(prueba)
})

router.get('/products', async (req, res) => {
    try {
      const limit = req.query.limit;
      const productos = await productManager.getProducts();
      if (!limit) {
        return res.status(200).json({
          success: true,
          productos: productos,
        });
      }
      const productosFiltrados = productos.slice(0, limit);
      res.status(200).json({
        success: true,
        productos: productosFiltrados,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
});

router.get('/products/:pid',async(req,res)=>{
    try {
        const {pid}=req.params
        const productFound=await productManager.getProdById(parseInt(pid))
        if(!productFound){
            return res.status(404).json({
                success:false,
                message:'no se encontro el producto'
            })
        }
        res.status(200).json({
            success:true,
            producto:productFound
        })
    } catch (error) {
        
    }
})

module.exports=router