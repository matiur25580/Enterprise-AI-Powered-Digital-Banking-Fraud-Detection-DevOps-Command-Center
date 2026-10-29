const express=require('express');
const r=express.Router();
r.get('/aml-report',(req,res)=>res.json({msg:'AML report generated',suspicious:7,checked:8540,date:new Date()}));
r.get('/kyc-stats',(req,res)=>res.json({pending:42,verified:1206,rejected:15}));
module.exports=r;
