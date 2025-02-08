const express=require('express')
const User=require("../models/User")
const {sendEmail} = require("../config/emailConfig");
const router=express.Router();
const Order = require("../models/Orders")
// Create a route for post

router.post('/users',async(req,res)=>{
    try{
      const{name,email,password,dob,phone}=req.body;
      const existingUser=await User.findOne({email});
      if(existingUser){
        return res.status(400).json({message:"User Already Exist"});
      }
      const newUser=new User({name,email,password,dob,phone});
      await newUser.save();
      const mailOptions={
        from :process.env.EMAIL_USER,
        to :email,
        subject:'Welcome to Our E- Commerce Ayurveda Platform',
        text:`Hi , ${name} , Thank You for registering in our app. Welcome to our platform .
        Hope you will like our services. `
      }
      const emailRes=await sendEmail(mailOptions);
      res.status(200).json({messsage:"HaHa,User Registered successfully and Email sent successfully",emailRes})
    }catch(error){
        res.status(500).json({message:"Error creating User",error});
    }
})

router.get("/users",async(req,res)=>{
    try{
        const result=await User.find({});
        res.status(200).json({message:"all users found",users:result})

    }catch(error){
        return res.status(500).json({message:"internal error"})
    }
})

router.get("/users/:id",async(req,res)=>{
    try{
     const user= await User.findById(req.params.id);
     if(!user){
        return res.status(404).json({message:"User Not Found"})
     }
     res.status(200).json({user});
    }catch(error){
        return res.status(500).json({message:"internal error",error})
    }
})

router.put("/users/:id",async(req,res)=>{
    try{
       // -> req.params.id
       // req.body 
       const updatedUser=await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
       if(!updatedUser){
        return res.status(404).json({message:"User Not Found"});
       }
       res.status(200).json({message:"User Updated Successfully",updatedUser})
    }catch(error){
        return res.status(500).json({message: "Error updating user",error})
    }
})

router.patch("/users/:id",async(req,res)=>
{
    try{

    
    const updatedUser=await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
    if(!updatedUser)
return res.status(404).json({message:"user not updated "})

    return res.status(200).json({message:"user updated successfuly",result:updatedUser})
} catch
    (error)
    {
        return res.return(500).json({message:"error updating user",error})
    }
    
}

)
router.delete("/users/:id",async(req,res)=>{
    try{
        const deleteuser = await User.findByIdAndDelete(req.params.id);
        if(!deleteuser){
            return res.status(404).json({message:"user not found"})
        }
        return res.status(200).json({message:"user deleted successfully"})
    }
    catch(error){
        return res.status(500).json({message:"error deleting user",error})
    }
})


router.get('/users/:id/orders', async (req, res) => {
    try {
        const { id } = req.params;
        const orders = await Order.find({ user: id })
            .populate('products.product', 'name price imageUrl')  // Adjust the populated fields as needed
            .exec();
            console.log("Orders found:", orders);
        if (!orders) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        res.status(200).json({ message: "Orders retrieved successfully.", orders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
});
module.exports=router;