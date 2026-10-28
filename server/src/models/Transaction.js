const mongoose=require('mongoose');
const s=new mongoose.Schema({amount:Number,fraudScore:Number});
module.exports=mongoose.model('Transaction',s);