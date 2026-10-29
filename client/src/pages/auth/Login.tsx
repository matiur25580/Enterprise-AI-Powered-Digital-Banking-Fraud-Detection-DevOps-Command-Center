import { useState } from 'react';
import SuccessToast from '../../components/SuccessToast';
export default function Login(){
  const [theme,setTheme]=useState('dark');
  const [show,setShow]=useState(false);
  const [role,setRole]=useState('Customer');
  const [msg,setMsg]=useState('');
  const dark=theme==='dark';
  const login=()=>{ setMsg('Login successful'); };
  return(
    <div style={{background:dark?'#0a1628':'#f1f5f9',color:dark?'#fff':'#0a1628',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}>
      <SuccessToast msg={msg} onClose={()=>setMsg('')} />
      <div style={{background:dark?'#111f3a':'#fff',padding:'30px',borderRadius:'12px',width:'100%',maxWidth:'400px',boxShadow:'0 10px 30px rgba(0,0,0,0.3)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2>🏦 TrustShield Bank</h2>
          <button onClick={()=>setTheme(dark?'light':'dark')}>🌙/☀️</button>
        </div>
        <p style={{color:'#94a3b8'}}>Secure Digital Banking Login</p>
        <label>Account Role</label>
        <select value={role} onChange={e=>setRole(e.target.value)} style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'8px'}}>
          <option>Admin</option><option>RiskManager</option><option>SupportAgent</option><option>Customer</option>
        </select>
        <label>Email</label>
        <input placeholder="you@bank.com" style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'8px',border:'1px solid #334155'}} />
        <label>Password</label>
        <div style={{display:'flex'}}>
          <input type={show?'text':'password'} placeholder="••••••••" style={{flex:1,padding:'10px',borderRadius:'8px 0 0 8px',border:'1px solid #334155'}} />
          <button onClick={()=>setShow(!show)} style={{borderRadius:'0 8px 8px 0'}}>👁️</button>
        </div>
        <button onClick={login} style={{width:'100%',padding:'12px',marginTop:'15px',background:'#16a34a',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'bold'}}>LOGIN</button>
        <p style={{marginTop:'10px',textAlign:'center'}}><a href="/forgot">Forgot Password?</a> | <a href="/register">Register</a></p>
      </div>
    </div>
  );
}
