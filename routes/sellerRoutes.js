const express=require('express')
const Seller=require("../models/Seller");
const router=express.Router();
const jwt=require('jsonwebtoken')

router.post("/seller",async(req,res)=>{
    try {
        const {name,email,password,storeName,address,contact}=req.body;
        if(!name || !email ||!password || !storeName ||!address || !contact){
            return res.status(400).send("all fields are required");
        } 
        const existingUser=await Seller.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"User Already Exist"});
          }
           const createdSeller={name,email,password,storeName,address,contact}
           const result=await Seller.create(createdSeller);
           return res.status(200).send({message:"seller created ",seller:result})
    } catch (error) {
        return res.status(500).send("internal error")
        
    }
})


router.post("/seller/bulk",async(req,res)=>{
    try{
       const sellers=req.body;// array of object
       if(!Array.isArray(sellers) || sellers.length===0){
        return res.status(400).json({message:"Invalid data pass kar rhe ho raja ji"})
       }
       const emails=sellers.map((sellerdata)=>sellerdata.email);
       // objects ->name,email,passw
       // emails ->[firstmail,secondmail,thiredmail]
       const existingUser= await Seller.find({email:{$in:emails}});
       if(existingUser.length>0){
        return res.status(400).json({message:"There are some users which already exist",existingUser});
       }
       const newSellers=await Seller.insertMany(sellers);
       res.status(200).json({message:"Seller registered Successfully",newSellers})
    }catch(err){
        return res.status(500).json({message:"There is some error in code"})
    }
})

router.get("/seller",async(req,res)=>{
    try{
        const result = await Seller.find({});
        res.status(200).json({message:"all sellers found",Seller:result})
     
    }catch(error){
        res.status(500).json('internal error')
    }
})

router.get("/seller/:id",async(req,res)=>{
    try{
          const seller=await Seller.findById(req.params.id);
          if(!seller){
            return res.status(404).json({message:"Seller not foudn"});
          }
          res.status(200).json({seller})
    }catch(error){
        return res.status(500).json({message:"Bhai Kahi galat user id to nahi add kar di "})
    }
})

router.post("/seller/login",async(req,res)=>{
    try{
      const{email,password}=req.body;
      const seller=await Seller.findOne({email});
      if(!seller){
        return res.status(400).json({message:"Bhai tu phle khud ko register kar yrr"});
      }
      if(seller.password !== password){
        return res.status(400).json({message:"Bhai Password Bhul gye kya "});
      }
      const token = jwt.sign(
        {id:seller._id,email:seller.email},
        process.env.JWT_SECRET,
        {expiresIn:'1h'}
      )

      res.status(200).json({message:"Badhai ho aap login ho gye jwt token is generated",token})
    }catch(err){
        return res.status(500).json({message:"An Error Occured During Login"})
    }
})
router.put("/seller/:id",async(req,res)=>{
    try {
        const user=await Seller.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!user)
            return res.status(400).send("user not updated")

        return res.status(200).send({message:"user updated successfully",updatedUser:user})
        
    } catch (error) {
        return res.status(500).json({message:"Bhai Kahi galat user id to nahi add kar di "})
        
    }
})

router.patch("/seller/:id",async(req,res)=>{
    try {
        const user=await Seller.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!user)
            return res.status(400).send("user not updated")

        return res.status(200).send({message:"user updated successfully",updatedUser:user})
        
    } catch (error) {
        return res.status(500).json({message:"Bhai Kahi galat user id to nahi add kar di "})
        
    }
})

router.delete("/seller/:id",async(req,res)=>{
    try {
        const user=await Seller.findByIdAndDelete(req.params.id)
        if(!user)
            return res.status(400).send("user not deleted")

        return res.status(200).send("user deleted successfully")
        
    } catch (error) {
        return res.status(500).json({message:"Bhai Kahi galat user id to nahi add kar di "})
        
    }
})
module.exports=router
