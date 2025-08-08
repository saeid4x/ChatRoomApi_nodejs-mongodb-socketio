const mongoose = require('mongoose');

const  connectDB = async(uri) =>{
    try{
        await mongoose.connect(uri)
        console.log(`Mongodb connected successfully`)
    } catch(err)
    {
        console.error(`MongoDB connection failed`, err.message);
        process.exit(1);
    }
}

module.exports= connectDB;