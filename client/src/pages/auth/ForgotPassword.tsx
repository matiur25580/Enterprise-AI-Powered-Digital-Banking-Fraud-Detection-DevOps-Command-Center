import { useState } from 'react';
import SuccessToast from '../../components/SuccessToast';
export default function ForgotPassword(){
  const [theme,setTheme]=useState('dark');
  const [otp,setOtp]=useState(['','','','','','']);
  const [msg,setMsg]=useState('');
  const dark=theme==='dark';
  const set=(i:number,v:string)=>{ const n=[...otp]; n[i]=v.slice(-1); setOtp(n); };
  return(
    <div style={{background:dark?'#0a1628':'#f1f5f9',color:dark?'#fff':'#0a1628',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}>
      <SuccessToast msg={msg} onClose={()=>setMsg('')} />
      <div style={{background:dark?'#111f3a':'#fff',padding:'30px',borderRadius:'12px',width:'100%',maxWidth:'400px',textAlign:'center'}}>
        <div style={{display:'flex',justifyContent:'space-between'}}><h2>🔐 Reset Password</h2><button onClick={()=>setTheme(dark?'light':'dark')}>🌙/☀️</button></div>
        <input placeholder="Registered Email" style={{width:'100%',padding:'10px',margin:'10px 0',borderRadius:'8px'}} />
        <button onClick={()=>setMsg('OTP sent to email')} style={{padding:'10px 20px',background:'#7c3aed',color:'#fff',border:'none',borderRadius:'8px'}}>Send OTP</button>
        <div style={{display:'flex',gap:'8px',justifyContent:'center',margin:'15px 0'}}>
          {otp.map((d,i)=><input key={i} value={d} onChange={e=>set(e.target.value,i)} maxLength={1} style={{width:'40px',height:'45px',textAlign:'center',fontSize:'20px',borderRadius:'8px'}} />)}
        </div>
        <p style={{color:'#94a3b8'}}>6-digit OTP • 3 min valid</p>
        <button onClick={()=>setMsg('Password reset successful')} style={{width:'100%',padding:'12px',background:'#16a34a',color:'#fff',border:'none',borderRadius:'8px'}}>Verify & Reset</button>
      </div>
    </div>
  );
}
