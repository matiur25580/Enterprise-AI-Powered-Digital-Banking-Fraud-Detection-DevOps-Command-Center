module.exports=function(io){
  io.on('connection',(socket)=>{
    console.log('client connected');
    setInterval(()=>{ socket.emit('newTx',{id:'TXN'+Date.now(), amount:Math.floor(Math.random()*20000)}); }, 5000);
  });
};
