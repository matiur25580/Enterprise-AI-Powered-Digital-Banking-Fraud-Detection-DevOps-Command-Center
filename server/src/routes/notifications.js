const express=require('express');
const r=express.Router();
let notes=[{id:1,text:'Large transfer flagged $18,000',time:new Date()}];
r.get('/list',(req,res)=>res.json(notes));
r.post('/add',(req,res)=>{ const n={id:Date.now(),...req.body,time:new Date()}; notes.unshift(n); res.json({msg:'Notification added',n}); });
module.exports=r;
