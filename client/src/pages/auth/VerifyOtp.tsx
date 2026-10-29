import { useState, useEffect } from 'react';
export default function VerifyOtp(){
  const [otp,setOtp]=useState(['','','','','','']);
  const [err,setErr]=useState('');
  const [msg,setMsg]=useState('');
  const [timer,setTimer]=useState(180);
  const dark=true;
  const params=new URLSearchParams(window.location.search);
  const email=params.get('email')||'';
  const uid=params.get('uid')||'';
  const name=params.get('name')||'';
  const role=params.get('role')||'';
  const otpStyle={width:'44px',height:'52px',textAlign:'center' as const,fontSize:'20px',borderRadius:'10px',
    background:'#1e293b',color:'#fff',border:'1px solid #475569'};
  const set=(i:number,v:string)=>{ const n=[...otp]; n[i]=v.slice(-1); setOtp(n);
    if(v && i<5){ const el=document.getElementById('otp-'+i); const nx=document.getElementById('otp-'+(i+1)); if(nx) nx.focus(); } };
  const sendOtp=async()=>{
    setMsg('Sending OTP...');
    try{
      const api=(import.meta as any).env.VITE_API_URL||'http://localhost:5000';
      await fetch(api+'/api/auth/send-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});
      setMsg('OTP sent to '+email);
      setTimer(180);
    }catch(e){ setErr('Failed to send OTP'); }
  };
  useEffect(()=>{ sendOtp(); },[]);
  useEffect(()=>{ if(timer>0){ const t=setTimeout(()=>setTimer(timer-1),1000); return ()=>clearTimeout(t); } },[timer]);
  const verify=async()=>{
    setErr('');
    const code=otp.join('');
    if(code.length<6){ setErr('Enter 6-digit OTP'); return; }
    try{
      const api=(import.meta as any).env.VITE_API_URL||'http://localhost:5000';
      const res=await fetch(api+'/api/auth/verify-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,otp:code})});
      const data=await res.json();
      if(!res.ok){ setErr(data.error||'Wrong OTP. Please try again.'); return; }
      window.location.href='/success?uid='+encodeURIComponent(uid)+'&name='+encodeURIComponent(name)+'&role='+encodeURIComponent(role);
    }catch(e){ setErr('Server error'); }
  };
  const mm=Math.floor(timer/60); const ss=timer%60;
  return(
    <div style={{background:'#0a1628',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',padding:'16px'}}>
      <div style={{background:'#111f3a',color:'#fff',padding:'28px',borderRadius:'16px',maxWidth:'400px',width:'100%',textAlign:'center'}}>
        <h2>🔐 Verify Email</h2>
        <p style={{color:'#94a3b8',fontSize:'13px'}}>6-digit OTP sent to<br/><b>{email}</b></p>
        {err&&<p style={{background:'#fee2e2',color:'#dc2626',padding:'10px',borderRadius:'8px',fontSize:'13px'}}>{err}</p>}
        {msg&&<p style={{background:'#1e3a5f',color:'#7dd3fc',padding:'10px',borderRadius:'8px',fontSize:'13px'}}>{msg}</p>}
        <div style={{display:'flex',gap:'8px',justifyContent:'center',margin:'16px 0'}}>
          {otp.map((d,i)=><input key={i} id={'otp-'+i} value={d} onChange={e=>set(i,e.target.value)} maxLength={1} style={otpStyle} />)}
        </div>
        <p style={{color:'#94a3b8',fontSize:'13px'}}>Valid for {mm}:{String(ss).padStart(2,'0')}</p>
        <button onClick={verify} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#2563eb',color:'#fff',fontWeight:'bold'}}>Verify</button>
      </div>
    </div>
  );
}
