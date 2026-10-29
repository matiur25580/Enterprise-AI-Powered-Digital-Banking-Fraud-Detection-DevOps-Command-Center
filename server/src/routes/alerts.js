const express=require('express');
const nodemailer=require('nodemailer');
const r=express.Router();
r.post('/freeze-alert', async(req,res)=>{
  const {email}=req.body;
  try{
    const t=nodemailer.createTransport({service:'gmail', auth:{user:process.env.EMAIL_USER, pass:process.env.EMAIL_PASS}});
    await t.sendMail({from:process.env.EMAIL_USER, to:email, subject:'Account Frozen', text:'Your account has been frozen by Admin.'});
    res.json({msg:'Freeze alert sent'});
  }catch(e){ res.status(500).json({msg:e.message}); }
});
module.exports=r;
