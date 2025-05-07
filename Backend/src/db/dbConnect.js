import mongoose from 'mongoose'


export const dbConnect = async(req, res) =>{

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connection to database successful: ${conn.connection.host}`)
        console.log(`Database name: ${conn.connection.name}`)
        
    } catch (error) {
        console.log('Error while connecting to databse')
        process.exit(1)
    }
}