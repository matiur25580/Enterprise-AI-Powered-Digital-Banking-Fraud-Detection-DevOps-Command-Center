import { useState } from 'react';
import SuccessToast from '../../components/SuccessToast';
export default function Register(){
  const [theme,setTheme]=useState('dark');
  const [msg,setMsg]=useState('');
  const dark=theme==='dark';
  return(
    <div style={{background:dark?'#0a1628':'#f1f5f9',color:dark?'#fff':'#0a1628',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}>
      <SuccessToast msg={msg} onClose={()=>setMsg('')} />
      <div style={{background:dark?'#111f3a':'#fff',padding:'30px',borderRadius:'12px',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',justifyContent:'space-between'}}><h2>🏦 Create Account</h2><button onClick={()=>setTheme(dark?'light':'dark')}>🌙/☀️</button></div>
        <input placeholder="Full Name" style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'8px'}} />
        <input placeholder="Email" style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'8px'}} />
        <input placeholder="Contact Number" style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'8px'}} />
        <input placeholder="Date of Birth DDMMYYYY" style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'8px'}} />
        <select style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'8px'}}><option>Customer</option><option>Admin</option><option>RiskManager</option><option>SupportAgent</option></select>
        <input type="password" placeholder="Password" style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'8px'}} />
        <input type="password" placeholder="Confirm Password" style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'8px'}} />
        <button onClick={()=>setMsg('Registration successful')} style={{width:'100%',padding:'12px',background:'#2563eb',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'bold'}}>SUBMIT</button>
        <p style={{textAlign:'center',marginTop:'10px'}}><a href="/login">Back to Login</a></p>
      </div>
    </div>
  );
}
