const express=require('express')
const router=express.Router()
const productRoutes=require('./product.Router/product.routes')
router.get('/health',(_req,res)=>{
    res.status(200).json({
        success:true, 
        health:'up'
    })
}).use(productRoutes)
module.exports=router