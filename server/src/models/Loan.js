const m=require('mongoose');
module.exports=m.model('Loan',new m.Schema({userId:String,amount:Number,months:Number,status:{type:String,default:'Pending'},createdAt:{type:Date,default:Date.now}}));
