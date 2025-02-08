const mongoose = require('mongoose');

require('dotenv').config();
// .env se mongouri ko use krne ke liye 

const connectDB = async () =>{
    try {
       await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
       });
       console.log("Mongo Db Connected Successfully");
    } catch(error){
        console.error("Mongodb Connection Failed",error);
        process.exit(1);
    }
}

module.exports= connectDB;