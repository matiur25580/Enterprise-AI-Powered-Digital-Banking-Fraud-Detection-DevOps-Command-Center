import { useState } from 'react';
const inputStyle = {width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',border:'1px solid #334155',fontSize:'14px',boxSizing:'border-box' as const};
export default function Register(){
  const [theme,setTheme]=useState('dark');
  const dark=theme==='dark';
  return(
    <div style={{background:dark?'#0a1628':'#f1f5f9',color:dark?'#fff':'#0a1628',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',padding:'16px'}}>
      <div style={{background:dark?'#111f3a':'#fff',padding:'28px',borderRadius:'16px',width:'100%',maxWidth:'380px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
          <h2 style={{margin:0,fontSize:'20px'}}>🏦 Create Account</h2>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{width:'40px',height:'32px',borderRadius:'8px',border:'1px solid #334155',cursor:'pointer'}}>🌙</button>
        </div>
        <input placeholder="Full Name" style={inputStyle} />
        <input placeholder="Email" style={inputStyle} />
        <input placeholder="Contact Number" style={inputStyle} />
        <input placeholder="Date of Birth DDMMYYYY" style={inputStyle} />
        <select style={inputStyle}><option>Customer</option><option>Admin</option><option>RiskManager</option><option>SupportAgent</option></select>
        <input type="password" placeholder="Password" style={inputStyle} />
        <input type="password" placeholder="Confirm Password" style={inputStyle} />
        <button style={{...inputStyle,background:'#2563eb',color:'#fff',border:'none',fontWeight:'bold',cursor:'pointer'}}>SUBMIT</button>
        <p style={{textAlign:'center',fontSize:'13px'}}><a href="/login">Back to Login</a></p>
      </div>
    </div>
  );
}
