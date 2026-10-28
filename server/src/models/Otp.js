const mongoose=require('mongoose');
const s=new mongoose.Schema({email:String,otp:String,expires:Date});
module.exports=mongoose.model('Otp',s);