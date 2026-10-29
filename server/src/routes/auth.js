const express=require('express');
const r=express.Router();
const {sendOTP}=require('../utils/sendEmail');
let users=[];
function genUID(name,dob,role){
  const clean=(name||'X').replace(/[^A-Za-z]/g,'').toUpperCase();
  const f=clean[0]||'X';
  const l=clean.length>1?clean[clean.length-1]:'X';
  const ri=(role||'C')[0].toUpperCase();
  const d=(dob||'01012000').replace(/[^0-9]/g,'').slice(0,8).padEnd(8,'0');
  return ri+f+l+d+'-'+Math.floor(1000+Math.random()*9000);
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
  const {email,password}=req.body;
  const u=users.find(x=>x.email===email);
  if(!u) return res.status(400).json({error:"This email doesn't exist. Please first register."});
  if(u.password!==password) return res.status(400).json({error:'Invalid credentials'});
  res.json({msg:'Login successful',user:u});
});
r.post('/send-otp',async(req,res)=>{
  const otp=Math.floor(100000+Math.random()*900000);
  try{ await sendOTP(req.body.email,otp); res.json({msg:'OTP sent',otp}); }
  catch(e){ res.json({msg:'OTP generated',otp}); }
});
module.exports=r;
