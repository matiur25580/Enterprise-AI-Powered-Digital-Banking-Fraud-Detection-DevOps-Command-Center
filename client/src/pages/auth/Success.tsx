import { useState } from 'react';
export default function Success(){
  const [theme]=useState('dark');
  const dark=theme==='dark';
  const params=new URLSearchParams(window.location.search);
  const uid=params.get('uid')||'N/A';
  const name=params.get('name')||'User';
  return(
    <div style={{background:dark?'#0a1628':'#f1f5f9',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',padding:'16px'}}>
      <div style={{background:dark?'#111f3a':'#fff',color:dark?'#fff':'#0a1628',padding:'32px',borderRadius:'16px',maxWidth:'420px',width:'100%',textAlign:'center',boxShadow:'0 10px 30px rgba(0,0,0,0.3)'}}>
        <div style={{fontSize:'48px'}}>✅</div>
        <h2 style={{color:'#16a34a',margin:'12px 0'}}>Registration Successful!</h2>
        <p>Welcome, <b>{name}</b></p>
        <p style={{color:'#94a3b8',fontSize:'13px'}}>Your Unique Banking ID</p>
        <h2 style={{background:dark?'#1e293b':'#f1f5f9',color:dark?'#fff':'#000',padding:'14px',borderRadius:'10px',letterSpacing:'1px',border:dark?'1px solid #475569':'1px solid #cbd5e1'}}>{uid}</h2>
        <p style={{background:'#fef3c7',color:'#92400e',padding:'12px',borderRadius:'10px',fontWeight:'bold',fontSize:'13px'}}>⚠️ Save it for future further reference</p>
        <p style={{fontSize:'12px',color:'#94a3b8'}}>Use this ID for login support, KYC and branch visits</p>
        <button onClick={()=>window.location.href='/login'} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#2563eb',color:'#fff',fontWeight:'bold',marginTop:'12px',cursor:'pointer'}}>Go to Login</button>
      </div>
    </div>
  );
}
