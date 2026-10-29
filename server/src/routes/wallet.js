const express=require('express');
const r=express.Router();
const rates={USD:1,EUR:0.92,INR:83.2};
r.get('/rates',(req,res)=>res.json(rates));
r.post('/convert',(req,res)=>{ const {from,to,amount}=req.body; const usd=amount/rates[from]; const out=usd*rates[to]; res.json({msg:'Converted successfully',result:out}); });
module.exports=r;
