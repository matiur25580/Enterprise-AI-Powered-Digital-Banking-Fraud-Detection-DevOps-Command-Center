const express=require('express');
const r=express.Router();
let logs=[];
r.post('/log', (req,res)=>{ const e={...req.body, time:new Date()}; logs.push(e); res.json({msg:'Logged', e}); });
r.get('/logs', (req,res)=>{ res.json(logs.slice(-50)); });
module.exports=r;
