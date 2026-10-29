const express=require('express');
const r=express.Router();
r.get('/wall',(req,res)=>res.json({
  volume:[120,180,150,220,190,240,200],
  fraudHeat:[{city:'Mumbai',n:12},{city:'Delhi',n:8},{city:'Kolkata',n:5}],
  branchPerf:[{b:'Mumbai HQ',t:4500},{b:'Delhi',t:2800}],
  msg:'Analytics wall data'
}));
module.exports=r;
