const fs=require('fs')

class ProductManager{
    constructor(ruta){
        this.ruta=ruta
    }
    async addProd(prod){
        
        try {
            const data=await fs.promises.readFile(this.ruta,'utf-8')
            const jsonData=JSON.parse(data)
            const id=jsonData.length+1 
            if(!prod.title||!prod.description||!prod.price||!prod.thumbnail||!prod.code||!prod.stock){
                console.log('los datos ingresados no son suficientes para agregar este producto')
                return
            }
            const productFound=jsonData.find(item=>item.code===prod.code)
            if(productFound){
                console.log('ya existe un producto con el codigo '+prod.code)
                return
            }
            const producto={...prod,id:id}
            jsonData.push(producto)
            await fs.promises.writeFile(this.ruta,JSON.stringify(jsonData,null, 2))
            console.log(`Producto ${producto.title} agregado de manera exitosa`)
            return jsonData
        } catch (error) {
            const id=1
            const producto={...prod,id:id}
            await fs.promises.writeFile(this.ruta,JSON.stringify([producto],null,2))
            console.log('el producto '+prod.title+' fue agregado exitosamente')
            return producto

        }


    }
    async getProducts(){

        try {
            const data=await fs.promises.readFile(this.ruta,'utf-8')
            const jsonData=JSON.parse(data)
            return jsonData
        } catch (error) {
            console.log(error)
        }

    }
    async getProdById(id){
        try {
            const data=await fs.promises.readFile(this.ruta,'utf-8')
            const jsonData=JSON.parse(data)
            
            const prodFound=jsonData.find(item=>item.id===id)
            console.log(prodFound)
            if(!prodFound){
                console.log('no existe tal producto')
                return
            }
            console.log(prodFound)
            return prodFound
        } catch (error) {
            console.log(error)
        }
    }
    async updateProd(id, prod){
        try {
            const data=await fs.promises.readFile(this.ruta,'utf-8')
            const jsonData=JSON.parse(data)
            const prodFound=jsonData.find(item=>item.id===id)
            if(!prodFound){
                console.log('no existe tal producto')
                return
            }
            const newList=jsonData.filter(item=>item.id!=id)
            const modifiedProd={...prodFound,...prod}
            newList.push(modifiedProd)
            
            await fs.promises.writeFile(this.ruta,JSON.stringify(newList, null, 2))
            console.log()
            return modifiedProd
        } catch (error) {
            console.log(error)
        }
    }
    async deleteProdById(id){
        try {
            const data=await fs.promises.readFile(this.ruta,'utf-8')
            const jsonData=JSON.parse(data)
            const prodFound=jsonData.find(item=>item.id===id)
            if(!prodFound){
                console.log('no existe tal producto')
                return
            }
            const newList=jsonData.filter(item=>item.id!=id)
            for(let i=0;i<newList.length;i++){
                newList[i]={...newList[i],id:(i+1)}

            }
            await fs.promises.writeFile(this.ruta,JSON.stringify(newList, null, 2))

            return newList
        } catch (error) {
            console.log(error)

        }
    }
}
const productManager=new ProductManager('./productos.txt')

module.exports=productManager