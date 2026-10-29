import { useState } from 'react';
export default function ForgotPassword(){
  const [theme,setTheme]=useState('dark');
  const [otp,setOtp]=useState(['','','','','','']);
  const [email,setEmail]=useState('');
  const [role,setRole]=useState('');
  const [err,setErr]=useState('');
  const [msg,setMsg]=useState('');
  const [sentOtp,setSentOtp]=useState('');
  const dark=theme==='dark';
  const inputStyle={width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',fontSize:'14px',boxSizing:'border-box' as const,
    background:dark?'#1e293b':'#ffffff',color:dark?'#ffffff':'#000000',border:dark?'1px solid #475569':'1px solid #cbd5e1'};
  const otpStyle={width:'44px',height:'48px',textAlign:'center' as const,fontSize:'18px',borderRadius:'10px',
    background:dark?'#1e293b':'#ffffff',color:dark?'#fff':'#000',border:dark?'1px solid #475569':'1px solid #cbd5e1'};
  const set=(i:number,v:string)=>{ const n=[...otp]; n[i]=v.slice(-1); setOtp(n); };
  const sendOtp=async()=>{
    if(!role){ setErr('Please select your role'); return; }
    setErr(''); setMsg('');
    if(!email){ setErr('Enter registered email'); return; }
    try{
      const api=(import.meta as any).env.VITE_API_URL||'http://localhost:5000';
      const res=await fetch(api+'/api/auth/send-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});
      const data=await res.json();
      setSentOtp(String(data.otp||''));
      setMsg('OTP sent to '+email);
    }catch(e){ setErr('Failed to send OTP'); }
  };
  const verify=()=>{
    setErr(''); setMsg('');
    const code=otp.join('');
    if(code.length<6){ setErr('Enter 6-digit OTP'); return; }
    if(sentOtp && code!==sentOtp){ setErr('Invalid OTP. Try again.'); return; }
    setMsg('Password reset successful. Please login with new password.');
  };
  return(
    <div style={{background:dark?'#0a1628':'#f1f5f9',color:dark?'#fff':'#0a1628',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',padding:'16px'}}>
      <div style={{background:dark?'#111f3a':'#fff',padding:'28px',borderRadius:'16px',width:'100%',maxWidth:'380px',textAlign:'center'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2 style={{margin:0,fontSize:'20px'}}>🔐 Reset Password</h2>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{width:'40px',height:'32px',borderRadius:'8px',cursor:'pointer',background:dark?'#1e293b':'#fff',border:'1px solid #475569'}}>🌙</button>
        </div>
        {err&&<p style={{background:'#fee2e2',color:'#dc2626',padding:'10px',borderRadius:'8px',fontSize:'13px'}}>{err}</p>}
        {msg&&<p style={{background:'#dcfce7',color:'#16a34a',padding:'10px',borderRadius:'8px',fontSize:'13px'}}>{msg}</p>}
        <select value={role} onChange={e=>setRole(e.target.value)} style={{...inputStyle,textAlign:'left'}}>
          <option value="" disabled>Select your role</option>
          <option>Customer</option><option>Admin</option><option>RiskManager</option><option>SupportAgent</option>
        </select>
        <input placeholder="Registered Email" value={email} onChange={e=>setEmail(e.target.value)} style={{...inputStyle,textAlign:'left'}} />
        <button onClick={sendOtp} style={{padding:'10px 24px',background:'#7c3aed',color:'#fff',border:'none',borderRadius:'10px',margin:'8px 0',cursor:'pointer'}}>Send OTP</button>
        <div style={{display:'flex',gap:'8px',justifyContent:'center',margin:'12px 0'}}>
          {otp.map((d,i)=><input key={i} value={d} onChange={e=>set(i,e.target.value)} maxLength={1} style={otpStyle} />)}
        </div>
        <p style={{color:'#94a3b8',fontSize:'13px'}}>6-digit OTP • 3 min valid</p>
        <button onClick={verify} style={{...inputStyle,background:'#2563eb',color:'#fff',border:'none',fontWeight:'bold',cursor:'pointer'}}>Verify & Reset</button>
        <p style={{fontSize:'13px'}}><a href="/login">Back to Login</a></p>
      </div>
    </div>
  );
}
