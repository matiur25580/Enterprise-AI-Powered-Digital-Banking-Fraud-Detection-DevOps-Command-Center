import { useState } from 'react';
export default function Login(){
  const [theme,setTheme]=useState('dark');
  const [role,setRole]=useState('Customer');
  const [email,setEmail]=useState('');
  const [pw,setPw]=useState('');
  const [err,setErr]=useState('');
  const [msg,setMsg]=useState('');
  const dark=theme==='dark';
  const s={width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',fontSize:'14px',boxSizing:'border-box' as const,
    background:dark?'#1e293b':'#ffffff',color:dark?'#ffffff':'#000000',border:dark?'1px solid #475569':'1px solid #cbd5e1'};
  const login=async()=>{
    setErr(''); setMsg('');
    try{
      const api=(import.meta as any).env.VITE_API_URL||'http://localhost:5000';
      const res=await fetch(api+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email,password:pw,role})});
      const data=await res.json();
      if(!res.ok){ setErr(data.error||'Login failed'); return; }
      setMsg('Login successful! Redirecting...');
      const r=data.user.role;
      setTimeout(()=>{
        if(r==='Admin') window.location.href='/admin';
        else if(r==='RiskManager') window.location.href='/riskmanager';
        else if(r==='SupportAgent') window.location.href='/supportagent';
        else window.location.href='/customer';
      },1000);
    }catch(e){ setErr('Server error'); }
  };
  return(
    <div style={{background:dark?'#0a1628':'#f1f5f9',color:dark?'#fff':'#0a1628',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',padding:'16px'}}>
      <div style={{background:dark?'#111f3a':'#fff',padding:'28px',borderRadius:'16px',width:'100%',maxWidth:'360px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2>🏦 TrustShield Login</h2>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{width:'40px',height:'32px',borderRadius:'8px'}}>🌙</button>
        </div>
        {err&&<p style={{background:'#fee2e2',color:'#dc2626',padding:'10px',borderRadius:'8px',fontSize:'13px'}}>{err}</p>}
        {msg&&<p style={{background:'#dcfce7',color:'#16a34a',padding:'10px',borderRadius:'8px',fontSize:'13px'}}>{msg}</p>}
        <select value={role} onChange={e=>setRole(e.target.value)} style={s}>
          <option>Customer</option><option>Admin</option><option>RiskManager</option><option>SupportAgent</option>
        </select>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={s} />
        <input placeholder="Password" type="password" value={pw} onChange={e=>setPw(e.target.value)} style={s} />
        <button onClick={login} style={{...s,background:'#2563eb',color:'#fff',border:'none',fontWeight:'bold'}}>Login</button>
        <p style={{textAlign:'center',fontSize:'13px'}}><a href="/forgot">Forgot?</a> | <a href="/register">Register</a></p>
      </div>
    </div>
  );
}
