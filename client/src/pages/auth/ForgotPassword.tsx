import { useState } from 'react';
export default function ForgotPassword(){
  const [email,setEmail]=useState('');
  const [msg,setMsg]=useState('');
  const [theme,setTheme]=useState('dark');
  const dark=theme==='dark';
  const inputStyle={width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',fontSize:'14px',boxSizing:'border-box' as const,
    background:dark?'#1e293b':'#ffffff',color:dark?'#ffffff':'#000000',border:dark?'1px solid #475569':'1px solid #cbd5e1'};
  return(
    <div style={{background:dark?'#0a1628':'#f1f5f9',color:dark?'#fff':'#0a1628',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',padding:'16px'}}>
      <div style={{background:dark?'#111f3a':'#fff',padding:'28px',borderRadius:'16px',width:'100%',maxWidth:'380px',textAlign:'center'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2 style={{margin:0,fontSize:'20px'}}>🔐 Password Recovery</h2>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{width:'40px',height:'32px',borderRadius:'8px'}}>🌙</button>
        </div>
        <p style={{fontSize:'13px',color:dark?'#cbd5e1':'#475569'}}>Secure password recovery is being implemented. No OTP will be sent and no password will be changed from this screen until the complete verified recovery flow is available.</p>
        <input placeholder="Registered Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle} />
        <button onClick={()=>setMsg('Password recovery is temporarily unavailable. Please contact the system administrator through the verified support channel.')} style={{...inputStyle,background:'#64748b',color:'#fff',border:'none',fontWeight:'bold'}}>Request recovery</button>
        {msg&&<p style={{fontSize:'13px'}}>{msg}</p>}
        <p style={{fontSize:'13px'}}><a href="/login">Back to Login</a></p>
      </div>
    </div>
  );
}
