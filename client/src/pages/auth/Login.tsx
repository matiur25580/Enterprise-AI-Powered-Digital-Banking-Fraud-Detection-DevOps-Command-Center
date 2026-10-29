import { useState } from 'react';
export default function Login(){
  const [theme,setTheme]=useState('dark');
  const [show,setShow]=useState(false);
  const dark=theme==='dark';
  const inputStyle={width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',fontSize:'14px',boxSizing:'border-box' as const,
    background:dark?'#1e293b':'#ffffff',color:dark?'#ffffff':'#000000',border:dark?'1px solid #475569':'1px solid #cbd5e1'};
  return(
    <div style={{background:dark?'#0a1628':'#f1f5f9',color:dark?'#fff':'#0a1628',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',padding:'16px'}}>
      <div style={{background:dark?'#111f3a':'#fff',padding:'28px',borderRadius:'16px',width:'100%',maxWidth:'380px',boxShadow:'0 10px 30px rgba(0,0,0,0.3)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
          <h2 style={{margin:0,fontSize:'20px'}}>🏦 TrustShield Bank</h2>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{width:'40px',height:'32px',borderRadius:'8px',border:'1px solid #475569',cursor:'pointer',background:dark?'#1e293b':'#fff'}}>🌙</button>
        </div>
        <p style={{color:'#94a3b8',fontSize:'13px',margin:'0 0 12px'}}>Secure Digital Banking Login</p>
        <label style={{fontSize:'13px',fontWeight:'bold'}}>Account Role</label>
        <select style={inputStyle}><option>Customer</option><option>Admin</option><option>RiskManager</option><option>SupportAgent</option></select>
        <label style={{fontSize:'13px',fontWeight:'bold'}}>Email</label>
        <input placeholder="you@bank.com" style={inputStyle} />
        <label style={{fontSize:'13px',fontWeight:'bold'}}>Password</label>
        <div style={{display:'flex',margin:'8px 0'}}>
          <input type={show?'text':'password'} placeholder="••••••••" style={{...inputStyle,margin:0,borderRadius:'10px 0 0 10px',flex:1}} />
          <button onClick={()=>setShow(!show)} style={{width:'48px',borderRadius:'0 10px 10px 0',border:dark?'1px solid #475569':'1px solid #cbd5e1',borderLeft:'none',cursor:'pointer',background:dark?'#1e293b':'#fff'}}>👁️</button>
        </div>
        <button style={{...inputStyle,background:'#2563eb',color:'#fff',border:'none',fontWeight:'bold',cursor:'pointer',marginTop:'12px'}}>LOGIN</button>
        <p style={{textAlign:'center',fontSize:'13px'}}><a href="/forgot">Forgot Password?</a> | <a href="/register">Register</a></p>
      </div>
    </div>
  );
}
