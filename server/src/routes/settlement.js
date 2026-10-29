const express=require('express');
const r=express.Router();
r.post('/swift',(req,res)=>{
  const utr='UTR'+Date.now();
  res.json({msg:'Inter-bank settlement initiated',utr,status:'Processing',eta:'2 hours'});
});
r.get('/status/:utr',(req,res)=>res.json({utr:req.params.utr,status:'Settled'}));
module.exports=r;
