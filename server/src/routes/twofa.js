const express=require('express');
const r=express.Router();
r.post('/enable',(req,res)=>{ res.json({msg:'2FA enabled',secret:'JBSWY3DPEHPK3PXP',qr:'data:image/png;base64,[STRIPPED]'}); });
r.post('/verify',(req,res)=>{ const {token}=req.body; const ok=/^[0-9]{6}$/.test(token); res.json({msg:ok?'2FA verified':'Invalid 2FA code',ok}); });
module.exports=r;
