const express=require('express');
const r=express.Router();
let tickets=[];
r.post('/raise',(req,res)=>{ const t={id:'DSP'+Date.now(),...req.body,status:'Open'}; tickets.push(t); res.json({msg:'Dispute raised successfully',t}); });
r.get('/list',(req,res)=>res.json(tickets));
r.post('/resolve/:id',(req,res)=>{ const t=tickets.find(x=>x.id===req.params.id); if(t) t.status='Resolved'; res.json({msg:'Dispute resolved successfully',t}); });
module.exports=r;
