const express=require('express');
const r=express.Router();
let staff=[];
r.post('/create',(req,res)=>{ const s={id:'STF'+Date.now(),...req.body,active:true}; staff.push(s); res.json({msg:'Staff created successfully',s}); });
r.get('/list',(req,res)=>res.json(staff));
r.post('/deactivate/:id',(req,res)=>{ const s=staff.find(x=>x.id===req.params.id); if(s) s.active=false; res.json({msg:'Staff deactivated'}); });
module.exports=r;
