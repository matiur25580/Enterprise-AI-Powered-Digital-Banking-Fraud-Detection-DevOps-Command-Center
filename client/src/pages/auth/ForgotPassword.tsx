import { useState } from 'react';
const inputStyle = {width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',border:'1px solid #334155',fontSize:'14px',boxSizing:'border-box' as const};
export default function ForgotPassword(){
  const [theme,setTheme]=useState('dark');
  const [otp,setOtp]=useState(['','','','','','']);
  const dark=theme==='dark';
  const set=(i:number,v:string)=>{ const n=[...otp]; n[i]=v.slice(-1); setOtp(n); };
  return(
    <div style={{background:dark?'#0a1628':'#f1f5f9',color:dark?'#fff':'#0a1628',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',padding:'16px'}}>
      <div style={{background:dark?'#111f3a':'#fff',padding:'28px',borderRadius:'16px',width:'100%',maxWidth:'380px',textAlign:'center'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2 style={{margin:0,fontSize:'20px'}}>🔐 Reset Password</h2>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{width:'40px',height:'32px',borderRadius:'8px',border:'1px solid #334155',cursor:'pointer'}}>🌙</button>
        </div>
        <input placeholder="Registered Email" style={{...inputStyle,textAlign:'left'}} />
        <button style={{padding:'10px 24px',background:'#7c3aed',color:'#fff',border:'none',borderRadius:'10px',margin:'8px 0',cursor:'pointer'}}>Send OTP</button>
        <div style={{display:'flex',gap:'8px',justifyContent:'center',margin:'12px 0'}}>
          {otp.map((d,i)=><input key={i} value={d} onChange={e=>set(i,e.target.value)} maxLength={1} style={{width:'44px',height:'48px',textAlign:'center',fontSize:'18px',borderRadius:'10px',border:'1px solid #334155'}} />)}
        </div>
        <p style={{color:'#94a3b8',fontSize:'13px'}}>6-digit OTP • 3 min valid</p>
        <button style={{...inputStyle,background:'#16a34a',color:'#fff',border:'none',fontWeight:'bold',cursor:'pointer'}}>Verify & Reset</button>
      </div>
    </div>
  );
}
