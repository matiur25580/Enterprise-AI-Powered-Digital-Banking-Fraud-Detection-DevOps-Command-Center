const express=require('express');
const axios=require('axios');
const Tx=require('../models/Transaction');
const r=express.Router();
r.post('/transfer',async(req,res)=>{
 try{
  const {amount,from,to}=req.body;
  let score=10;
  try{
   const ai=await axios.get('http://localhost:8000/fraud-score',{params:{amount}});
   score=ai.data.score||ai.data.fraudScore||10;
  }catch(e){}
  const status=score>70?'FLAGGED':'APPROVED';
  const tx=await Tx.create({amount,fraudScore:score,status});
  res.json({msg:'Transfer '+status,tx});
 }catch(e){res.status(500).json({msg:e.message})}
});
r.get('/transactions',async(req,res)=>{
 const list=await Tx.find().sort({_id:-1}).limit(50);
 res.json(list);
});
module.exports=r;