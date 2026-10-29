const express=require('express');
const r=express.Router();
let loans=[];
r.post('/apply',(req,res)=>{ const l={id:'LN'+Date.now(),...req.body,status:'Pending'}; loans.push(l); res.json({msg:'Loan applied successfully',l}); });
r.get('/list',(req,res)=>res.json(loans));
r.post('/approve/:id',(req,res)=>{ const l=loans.find(x=>x.id===req.params.id); if(l) l.status='Approved'; res.json({msg:'Loan approved successfully',l}); });
module.exports=r;
