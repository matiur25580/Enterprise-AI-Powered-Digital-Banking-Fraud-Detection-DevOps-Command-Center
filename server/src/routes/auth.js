const express=require('express');
const r=express.Router();
const {sendOTP}=require('../utils/sendEmail');
const User=require('../models/User');
let otpStore={};
function genUID(name,dob,role){
  const X=((role||'C')[0]||'X').toUpperCase();
  const parts=(name||'X X').trim().split(/\s+/);
  const Y=(parts[0][0]||'X').toUpperCase();
  const Z=(parts.length>1?parts[parts.length-1][0]:'X').toUpperCase();
  const d=(dob||'01012000').replace(/[^0-9]/g,'').padEnd(8,'0').slice(0,8);
  return X+Y+Z+d.slice(0,2)+d.slice(2,4)+d.slice(4,8);
}
r.post('/register',async(req,res)=>{
  try{
    const {name,email,password,role,dob}=req.body;
    if(!email||!password) return res.status(400).json({error:'Email and password required'});
    const userRole=role||'Customer';
    const exists=await User.findOne({email,role:userRole});
    if(exists) return res.status(400).json({error:'This email is already registered as '+userRole+'. Please login or choose a different role.'});
    const uid=genUID(name||email,dob,userRole);
    const u=await User.create({uid,name,email,password,role:userRole,dob});
    res.json({msg:'Registration successful',uid,message:'Save it for future further reference',user:u});
  }catch(e){ res.status(500).json({error:e.message}); }
});
r.post('/login',async(req,res)=>{
  try{
    const {email,password,role}=req.body;
    const loginId=(email||'').trim();
    let u;
    if(role){ u=await User.findOne({$or:[{email:loginId},{uid:loginId}],role}); }
    else{ u=await User.findOne({$or:[{email:loginId},{uid:loginId}]}); }
    if(!u){
      const anyId=await User.findOne({$or:[{email:loginId},{uid:loginId}]});
      if(anyId){
        const roles=await User.find({$or:[{email:loginId},{uid:loginId}]}).distinct('role');
        return res.status(400).json({error:'No '+role+' account with this ID. You have: '+roles.join(', ')});
      }
      return res.status(400).json({error:"This email / ID doesn't exist. Please first register."});
    }
    if(u.password!==password) return res.status(400).json({error:'Wrong password. Please try again.'});
    res.json({msg:'Login successful',user:u});
  }catch(e){ res.status(500).json({error:e.message}); }
});
r.post('/send-otp',async(req,res)=>{
  const otp=Math.floor(100000+Math.random()*900000);
  otpStore[req.body.email]=String(otp);
  try{ await sendOTP(req.body.email,otp); res.json({msg:'OTP sent'}); }
  catch(e){ console.log('OTP email error:', e.message); res.json({msg:'OTP generated',emailError:e.message}); }
});
r.post('/verify-otp',(req,res)=>{
  const {email,otp}=req.body;
  if(otpStore[email] && otpStore[email]===String(otp)){
    delete otpStore[email];
    return res.json({msg:'OTP verified'});
  }
  return res.status(400).json({error:'Wrong OTP. Please try again.'});
});
r.get('/admin/users', async(req,res)=>{
  try{
    const User=require('../models/User');
    const users=await User.find({},{password:0}).limit(100);
    res.json(users);
  }catch(e){ res.status(500).json({error:e.message}); }
});
module.exports=r;
