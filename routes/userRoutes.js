const express=require('express')
const User=require("../models/User")
const {sendEmail} = require("../config/emailConfig");
const router=express.Router();
const Order = require("../models/Orders")
const crypto = require('crypto');
const jwt= require('jsonwebtoken')
// Create a route for post
// function for creation generate otp :
function generateOTP() {
    const otp = crypto.randomInt(100000, 999999); // generates a six-digit random number
    return otp.toString();
}
router.post('/users/register', async (req, res) => {
    const { name, email, password, dob, phone } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Oops! This email is already registered with us." });
        }

        const newUser = new User({ name, email, password, dob, phone });
        await newUser.save();

        // Generate OTP
        const otp = generateOTP();
        // Create a JWT token with the OTP ye otp verify ke time kam aayega
        /// ye token verify otp tak shahi hai 

        // const token = jwt.sign({ otp: otp }, process.env.JWT_SECRET, { expiresIn: '10m' });

        // aur ye track karne ke liye ki email verify hui h ye nahi iss line me email include krna hoga
        const token = jwt.sign({ email: email, otp: otp }, process.env.JWT_SECRET, { expiresIn: '10m' });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Our e-Ayurveda Platform!',
            text: `Dear ${name},\n\nThank you for registering at our e-Ayurveda platform. We are thrilled to have you on board. Please verify your email address using the following One Time Password (OTP): ${otp}. This OTP is valid for only 10 minutes.\n\nIf you did not initiate this request, please ignore this email or contact us for support.\n\nBest Regards,\nThe e-Ayurveda Team`
        };

        const emailRes = await sendEmail(mailOptions);
        res.status(200).json({ message: "User registered successfully! An OTP has been sent to your email.", emailRes, token });
    } catch (error) {
        res.status(500).json({ message: "There was an error creating your account, please try again.", error });
    }
});


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

router.post('/users/verify-otp',async(req,res)=>{
    const{token,userOtp}=req.body;
    try {
         const decoded = jwt.verify(token,process.env.JWT_SECRET);
         if(decoded.otp=== userOtp){
            // ye line tab add karni hai jab aap ye chahte hai ki jab tak otp verify na ho tab tak login route access na ho 
            await User.updateOne({ email: decoded.email }, { isEmailVerified: true });
            res.status(200).json({message:"OTP Verified Successfully"});
         }else{
            res.status(400).json({message:"Invalid OTP , please try again."})
         }
    } catch (error) {
        return res.status(500).json({message:"Otp verification Failed or Otp has expired"})
    }
})

router.post('/users/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({ message: "Please verify your email address to login." });
        }

        // Directly compare the password without hashing
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }  // Token is valid for 1 hour
        );

        res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});

module.exports=router;