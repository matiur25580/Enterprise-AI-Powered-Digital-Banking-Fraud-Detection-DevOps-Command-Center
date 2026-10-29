const express=require('express');
const r=express.Router();
const {sendOTP}=require('../utils/sendEmail');
let users=[];
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
  const exists=users.find(u=>u.email===email);
  if(exists) return res.status(400).json({error:'This email address already registered. Please login.'});
  const uid=genUID(name||email,dob,role);
  const u={uid,name,email,password,role:role||'Customer',dob};
  users.push(u);
  res.json({msg:'Registration successful',uid,message:'Save it for future further reference',user:u});
});
r.post('/login',(req,res)=>{
  const {email,password,role}=req.body;
  const u=users.find(x=>x.email===email);
  if(!u) return res.status(400).json({error:"This email doesn't exist. Please first register."});
  if(u.password!==password) return res.status(400).json({error:'Wrong password. Please try again.'});
  if(role && u.role!==role) return res.status(400).json({error:'Role mismatch. You registered as '+u.role+'. Please select correct role.'});
  res.json({msg:'Login successful',user:u});
});
r.post('/send-otp',async(req,res)=>{
  const otp=Math.floor(100000+Math.random()*900000);
  try{ await sendOTP(req.body.email,otp); res.json({msg:'OTP sent'}); }
  catch(e){ console.log('OTP email error:', e.message); res.json({msg:'OTP generated',otp,emailError:e.message}); }
});
module.exports=r;
