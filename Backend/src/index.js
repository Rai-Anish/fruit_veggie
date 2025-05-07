import dotenv from 'dotenv'
import { dbConnect } from './db/dbConnect.js'
import { app } from './app.js'

dotenv.config()


dbConnect()
.then(()=>{
    app.on('error',(error)=>{
        console.log("Error occured during database connection: ",error)
    })
})
.then( ()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log("Server is running at port: ",process.env.PORT)
    })
})
.catch((err)=>{
    console.log("Mongo db connection failed ",err)
})