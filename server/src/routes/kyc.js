const express=require('express');
const r=express.Router();
let docs=[];
r.post('/upload',(req,res)=>{ const d={id:'KYC'+Date.now(),...req.body,status:'Pending'}; docs.push(d); res.json({msg:'KYC document uploaded successfully',d}); });
r.get('/list',(req,res)=>res.json(docs));
r.post('/verify/:id',(req,res)=>{ const d=docs.find(x=>x.id===req.params.id); if(d) d.status='Verified'; res.json({msg:'KYC verified successfully',d}); });
module.exports=r;
