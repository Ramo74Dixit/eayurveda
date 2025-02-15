// Basic Setup of Express Js
const connectDB = require("./config/db")
const express = require('express');
const cors=require('cors')
const userroutes=require("./routes/userRoutes")
const sellerroutes=require("./routes/sellerRoutes")
const productroutes=require("./routes/productRoutes")
const orderroutes=require("./routes/orderRoutes")
require('dotenv').config();
// reference to express
const app = express();
app.use(express.json());
app.use(cors())
// call this function for connection
connectDB();
app.get('/',(req,res)=>{
    res.send('Hello World First Program of Express Js By Ram Mohan')
})
app.use('/api',userroutes);
app.use("/api",sellerroutes);
app.use("/api",productroutes);
app.use("/api",orderroutes);
app.listen(8080,()=>{
    console.log('Server is running on port 3000');
})
