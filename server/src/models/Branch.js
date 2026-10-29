const m=require('mongoose');
module.exports=m.model('Branch',new m.Schema({name:String,staff:Number}));
