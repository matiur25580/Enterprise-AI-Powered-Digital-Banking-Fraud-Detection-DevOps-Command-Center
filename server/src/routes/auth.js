const express=require('express');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/User');
const Otp=require('../models/Otp');
const {sendOTP}=require('../utils/sendEmail');
const r=express.Router();
r.post('/register',async(req,res)=>{
 try{
  const {name,email,password,role}=req.body;
  const ex=await User.findOne({email});
  if(ex) return res.status(400).json({msg:'This email already registered'});
  const h=await bcrypt.hash(password,10);
  await User.create({name,email,password:h,role});
  const otp=Math.floor(100000+Math.random()*900000).toString();
  await Otp.create({email,otp,expires:new Date(Date.now()+3*60*1000)});
  await sendOTP(email,otp);
  res.json({msg:'Registered. OTP sent to email (3 min valid)'});
 }catch(e){res.status(500).json({msg:e.message})}
});
r.post('/verify-otp',async(req,res)=>{
 const {email,otp}=req.body;
 const f=await Otp.findOne({email,otp});
 if(!f||f.expires<new Date()) return res.status(400).json({msg:'Invalid or expired OTP'});
 await Otp.deleteMany({email});
 res.json({msg:'Verified successfully'});
});
r.post('/login',async(req,res)=>{
 const {email,password}=req.body;
 const u=await User.findOne({email});
 if(!u) return res.status(400).json({msg:'This email doesnt exist, plz register first'});
 const ok=await bcrypt.compare(password,u.password);
 if(!ok) return res.status(400).json({msg:'Invalid credentials'});
 const token=jwt.sign({id:u._id,role:u.role},process.env.JWT_SECRET||'secret',{expiresIn:'7d'});
 res.json({token,role:u.role,msg:'Login successful'});
});
module.exports=r;