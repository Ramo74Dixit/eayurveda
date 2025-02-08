// const {express } = require('express');
const nodemailer= require('nodemailer');
// create a transport
const transporter= nodemailer.createTransport({
    service:"gmail",
    // gmail,yahoo,outllok
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})
// function for mailing
// mail options -> kisko mail bhejni hai ,kya mail bhejni hai , kiske through mail ja rhi hai vo , kya subject ail ka hoga vo 
const sendEmail = async (mailOptions) =>{
    try{
      const info = await transporter.sendMail(mailOptions);
      return {success: true,response:info.response};
    }catch(err){
        return {success: false,error:err};
    }
}

module.exports={sendEmail}