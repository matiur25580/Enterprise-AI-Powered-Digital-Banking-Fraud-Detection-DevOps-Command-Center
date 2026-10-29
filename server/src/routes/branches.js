const express=require('express');
const r=express.Router();
let branches=[{id:'BR001',name:'Mumbai HQ',staff:45},{id:'BR002',name:'Delhi Branch',staff:28}];
r.get('/list',(req,res)=>res.json(branches));
r.post('/add',(req,res)=>{ const b={id:'BR'+Date.now(),...req.body}; branches.push(b); res.json({msg:'Branch added successfully',b}); });
module.exports=r;
