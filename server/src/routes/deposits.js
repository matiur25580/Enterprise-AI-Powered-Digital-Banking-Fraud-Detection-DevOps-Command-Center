const express=require('express');
const r=express.Router();
let fds=[];
r.post('/fd',(req,res)=>{
  const {amount,months}=req.body;
  const rate=7.1;
  const maturity=amount*Math.pow(1+rate/400,months/3);
  const fd={id:'FD'+Date.now(),amount,months,rate,maturity:Math.round(maturity),status:'Active'};
  fds.push(fd); res.json({msg:'FD created successfully',fd});
});
r.get('/fds',(req,res)=>res.json(fds));
module.exports=r;
