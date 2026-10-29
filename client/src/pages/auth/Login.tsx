import { useState } from 'react';
export default function Login(){
  const [theme,setTheme]=useState('dark');
  const [show,setShow]=useState(false);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('Customer');
  const [err,setErr]=useState('');
  const dark=theme==='dark';
  const inputStyle={width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',fontSize:'14px',boxSizing:'border-box' as const,
    background:dark?'#1e293b':'#ffffff',color:dark?'#ffffff':'#000000',border:dark?'1px solid #475569':'1px solid #cbd5e1'};
  const login=async()=>{
    setErr('');
    try{
      const api=(import.meta as any).env.VITE_API_URL||'http://localhost:5000';
      const res=await fetch(api+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email,password,role})});
      const data=await res.json();
      if(!res.ok){ setErr(data.error||'Login failed'); return; }
      localStorage.setItem('token','ok');
      localStorage.setItem('role',data.user.role);
      const r=data.user.role.toLowerCase();
      window.location.href=r==='admin'?'/admin':r==='riskmanager'?'/riskmanager':r==='supportagent'?'/supportagent':'/customer';
    }catch(e){ setErr('Server error. Try again.'); }
  };
  return(
    <div style={{background:dark?'#0a1628':'#f1f5f9',color:dark?'#fff':'#0a1628',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',padding:'16px'}}>
      <div style={{background:dark?'#111f3a':'#fff',padding:'28px',borderRadius:'16px',width:'100%',maxWidth:'380px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
          <h2 style={{margin:0,fontSize:'20px'}}>🏦 TrustShield Bank</h2>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{width:'40px',height:'32px',borderRadius:'8px',cursor:'pointer',background:dark?'#1e293b':'#fff',border:'1px solid #475569'}}>🌙</button>
        </div>
        <p style={{color:'#94a3b8',fontSize:'13px'}}>Secure Digital Banking Login</p>
        {err&&<p style={{background:'#fee2e2',color:'#dc2626',padding:'10px',borderRadius:'8px',fontSize:'13px'}}>{err}</p>}
        <label style={{fontSize:'13px',fontWeight:'bold'}}>Account Role</label>
        <select value={role} onChange={e=>setRole(e.target.value)} style={inputStyle}>
          <option>Customer</option><option>Admin</option><option>RiskManager</option><option>SupportAgent</option>
        </select>
        <label style={{fontSize:'13px',fontWeight:'bold'}}>Email</label>
        <input placeholder="you@bank.com" value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle} />
        <label style={{fontSize:'13px',fontWeight:'bold'}}>Password</label>
        <div style={{display:'flex',margin:'8px 0'}}>
          <input type={show?'text':'password'} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} style={{...inputStyle,margin:0,borderRadius:'10px 0 0 10px',flex:1}} />
          <button onClick={()=>setShow(!show)} style={{width:'48px',borderRadius:'0 10px 10px 0',border:dark?'1px solid #475569':'1px solid #cbd5e1',borderLeft:'none',cursor:'pointer',background:dark?'#1e293b':'#fff'}}>👁️</button>
        </div>
        <button onClick={login} style={{...inputStyle,background:'#2563eb',color:'#fff',border:'none',fontWeight:'bold',cursor:'pointer',marginTop:'12px'}}>LOGIN</button>
        <p style={{textAlign:'center',fontSize:'13px'}}><a href="/forgot">Forgot Password?</a> | <a href="/register">Register</a></p>
      </div>
    </div>
  );
}
