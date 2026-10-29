const express=require('express');
const r=express.Router();
const {sendOTP}=require('../utils/sendEmail');
let users=[];
let otpStore={};
function genUID(name,dob,role){
  const X=((role||'C')[0]||'X').toUpperCase();
  const parts=(name||'X X').trim().split(/\s+/);
  const Y=(parts[0][0]||'X').toUpperCase();
  const Z=(parts.length>1?parts[parts.length-1][0]:'X').toUpperCase();
  const d=(dob||'01012000').replace(/[^0-9]/g,'').padEnd(8,'0').slice(0,8);
  return X+Y+Z+d.slice(0,2)+d.slice(2,4)+d.slice(4,8);
}
r.post('/register',(req,res)=>{
  const {name,email,password,role,dob}=req.body;
  if(!email||!password) return res.status(400).json({error:'Email and password required'});
  const userRole=role||'Customer';
  const exists=users.find(u=>u.email===email && u.role===userRole);
  if(exists) return res.status(400).json({error:'This email is already registered as '+userRole+'. Please login or choose a different role.'});
  const uid=genUID(name||email,dob,userRole);
  const u={uid,name,email,password,role:userRole,dob};
  users.push(u);
  res.json({msg:'Registration successful',uid,message:'Save it for future further reference',user:u});
});
r.post('/login',(req,res)=>{
  const {email,password,role}=req.body;
  const loginId=(email||'').trim();
  let u;
  if(role){ u=users.find(x=>(x.email===loginId||x.uid===loginId) && x.role===role); }
  else{ u=users.find(x=>x.email===loginId||x.uid===loginId); }
  if(!u){
    const anyEmail=users.find(x=>x.email===email);
    if(anyEmail) return res.status(400).json({error:'No '+role+' account with this email. You have: '+users.filter(x=>x.email===email).map(x=>x.role).join(', ')});
    return res.status(400).json({error:"This email doesn't exist. Please first register."});
  }
  if(u.password!==password) return res.status(400).json({error:'Wrong password. Please try again.'});
  res.json({msg:'Login successful',user:u});
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
module.exports=r;
