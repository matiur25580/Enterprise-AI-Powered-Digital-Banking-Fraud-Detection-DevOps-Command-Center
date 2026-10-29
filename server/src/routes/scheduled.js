const express=require('express');
const r=express.Router();
let jobs=[];
r.post('/create',(req,res)=>{ const j={id:'SCH'+Date.now(),...req.body,active:true}; jobs.push(j); res.json({msg:'Scheduled payment created',j}); });
r.get('/list',(req,res)=>res.json(jobs));
r.post('/cancel/:id',(req,res)=>{ const j=jobs.find(x=>x.id===req.params.id); if(j) j.active=false; res.json({msg:'Scheduled payment cancelled'}); });
module.exports=r;
