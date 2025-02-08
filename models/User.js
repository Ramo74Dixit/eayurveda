const mongoose=require('mongoose');
const UserSchema= new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    dob:{type:Date,required:true},
    phone:{type:String,unique:true,required:true},
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    // ye tab add karna hai jab tak user email verify nahi karega he can not access login route 
    isEmailVerified: { type: Boolean, default: false }
})

module.exports=mongoose.model('User',UserSchema);
