const express=require('express');
const r=express.Router();
r.post('/ask',(req,res)=>{
  const q=(req.body.q||'').toLowerCase();
  let a='I can help with balance, statement, loan queries.';
  if(q.includes('balance')) a='Your current balance is $12,450.00';
  else if(q.includes('loan')) a='You have 1 active loan. EMI $450 due on 5th.';
  else if(q.includes('statement')) a='You can download PDF statement from dashboard.';
  res.json({reply:a});
});
module.exports=r;
