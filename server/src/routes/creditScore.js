const express=require('express');
const r=express.Router();
r.get('/:userId',(req,res)=>{
  const score=650+Math.floor(Math.random()*200);
  res.json({userId:req.params.userId,score,grade:score>750?'Excellent':score>650?'Good':'Need Improvement',msg:'Credit score generated'});
});
module.exports=r;
