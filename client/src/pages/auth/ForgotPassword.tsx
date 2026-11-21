import { useState } from 'react';
export default function ForgotPassword(){
  const [email,setEmail]=useState('');
  const [code,setCode]=useState('');
  const [password,setPassword]=useState('');
  const [confirm,setConfirm]=useState('');
  const [stage,setStage]=useState<'request'|'reset'>('request');
  const [msg,setMsg]=useState('');
  const [err,setErr]=useState('');
  const [busy,setBusy]=useState(false);
  const [theme,setTheme]=useState('dark');
  const dark=theme==='dark';
  const api=(import.meta as any).env.VITE_API_URL||'http://localhost:5000';
  const inputStyle={width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',fontSize:'14px',boxSizing:'border-box' as const,
    background:dark?'#1e293b':'#ffffff',color:dark?'#ffffff':'#000000',border:dark?'1px solid #475569':'1px solid #cbd5e1'};
  const requestCode=async()=>{
    setErr(''); setMsg(''); setBusy(true);
    try{
      const response=await fetch(api+'/api/auth/password/forgot',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});
      const data=await response.json();
      if(!response.ok) throw new Error(data.error||'Unable to request recovery');
      setStage('reset');
      setMsg(data.msg||'If an eligible account exists, recovery instructions will be sent. Check your email.');
    }catch(error:any){setErr(error.message||'Unable to request recovery');}
    finally{setBusy(false);}
  };
  const resetPassword=async()=>{
    setErr(''); setMsg('');
    if(password.length<12){setErr('New password must contain at least 12 characters');return;}
    if(password!==confirm){setErr('Passwords do not match');return;}
    setBusy(true);
    try{
      const response=await fetch(api+'/api/auth/password/reset',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,code,newPassword:password})});
      const data=await response.json();
      if(!response.ok) throw new Error(data.error||'Password reset failed');
      setMsg('Password reset successful. Please sign in with your new password.');
      setCode('');setPassword('');setConfirm('');
    }catch(error:any){setErr(error.message||'Password reset failed');}
    finally{setBusy(false);}
  };
  return(
    <div style={{background:dark?'#0a1628':'#f1f5f9',color:dark?'#fff':'#0a1628',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',padding:'16px'}}>
      <div style={{background:dark?'#111f3a':'#fff',padding:'28px',borderRadius:'16px',width:'100%',maxWidth:'380px',textAlign:'center'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2 style={{margin:0,fontSize:'20px'}}>🔐 Password Recovery</h2>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{width:'40px',height:'32px',borderRadius:'8px'}}>🌙</button>
        </div>
        <p style={{fontSize:'13px',color:dark?'#cbd5e1':'#475569'}}>A one-time recovery code is valid for 10 minutes. For account privacy, the response does not reveal whether an email is registered.</p>
        {err&&<p style={{background:'#fee2e2',color:'#dc2626',padding:'10px',borderRadius:'8px',fontSize:'13px'}}>{err}</p>}
        {msg&&<p style={{background:'#dcfce7',color:'#166534',padding:'10px',borderRadius:'8px',fontSize:'13px'}}>{msg}</p>}
        <input placeholder="Registered Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle} disabled={stage==='reset'}/>
        {stage==='request'?(
          <button disabled={busy||!email} onClick={requestCode} style={{...inputStyle,background:'#2563eb',color:'#fff',border:'none',fontWeight:'bold'}}>{busy?'Sending...':'Send recovery code'}</button>
        ):(
          <>
            <input placeholder="6-digit recovery code" inputMode="numeric" maxLength={6} value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,''))} style={inputStyle}/>
            <input placeholder="New password (12+ characters)" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={inputStyle}/>
            <input placeholder="Confirm new password" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} style={inputStyle}/>
            <button disabled={busy} onClick={resetPassword} style={{...inputStyle,background:'#2563eb',color:'#fff',border:'none',fontWeight:'bold'}}>{busy?'Updating...':'Reset password'}</button>
            <button onClick={()=>{setStage('request');setMsg('');setErr('');}} style={{...inputStyle,background:'transparent',color:dark?'#fff':'#0a1628'}}>Request another code</button>
          </>
        )}
        <p style={{fontSize:'13px'}}><a href="/login">Back to Login</a></p>
      </div>
    </div>
  );
}
