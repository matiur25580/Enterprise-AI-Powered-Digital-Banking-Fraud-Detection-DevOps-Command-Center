const express=require('express');
const r=express.Router();
r.get('/metrics', (req,res)=>{
  res.json({ accuracy:94.2, totalScanned:8540, flagged:23, model:'v2.1', uptime:'99.9%' });
});
module.exports=r;
