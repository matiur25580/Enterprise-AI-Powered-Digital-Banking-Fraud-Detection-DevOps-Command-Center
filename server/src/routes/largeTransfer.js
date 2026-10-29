const express=require('express');
const Otp=require('../models/Otp');
const {sendOTP}=require('../utils/sendEmail');
const r=express.Router();
r.post('/request-large', async(req,res)=>{
  const {email, amount}=req.body;
  if(amount < 10000) return res.json({needOtp:false});
  const otp=Math.floor(100000+Math.random()*900000).toString();
  await Otp.create({email, otp, expires:new Date(Date.now()+3*60*1000)});
  await sendOTP(email, otp);
  res.json({needOtp:true, msg:'OTP sent for large transfer'});
});
module.exports=r;
