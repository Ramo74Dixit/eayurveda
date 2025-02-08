const mongoose = require('mongoose');

const SellerSChema = new mongoose.Schema(
{
name:{type:String,required:true,},
email:{type:String,required:true,unique:true},
password:{type:String,required:true,unique:true},
contact:{type:String,required:true,unique:true},
storeName:{type:String,required:true,unique:true},
address:{type:String,required:true}




})

module.exports=mongoose.model('Seller',SellerSChema);

