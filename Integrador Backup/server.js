const http=require('./app')

const PORT=process.env.PORT||8080

http.listen(PORT,()=>{console.log('server up and running in port '+PORT)})