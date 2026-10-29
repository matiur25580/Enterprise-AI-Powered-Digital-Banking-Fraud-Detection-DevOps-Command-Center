const express=require('express');
const r=express.Router();
r.get('/statement/:userId', (req,res)=>{
  res.setHeader('Content-Type','application/pdf');
  res.json({msg:'PDF statement for '+req.params.userId+' - integrate pdfkit here'});
});
module.exports=r;
