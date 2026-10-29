import { useState } from 'react';
export default function TwoFA(){
  const [theme,setTheme]=useState('dark');
  const [code,setCode]=useState(['','','','','','']);
  const [msg,setMsg]=useState('');
  const dark=theme==='dark';
  const otpStyle={width:'44px',height:'48px',textAlign:'center' as const,fontSize:'18px',borderRadius:'10px',
    background:dark?'#1e293b':'#ffffff',color:dark?'#fff':'#000',border:dark?'1px solid #475569':'1px solid #cbd5e1'};
  const set=(i:number,v:string)=>{const n=[...code];n[i]=v.slice(-1);setCode(n);};
  return(
    <div style={{background:dark?'#0a1628':'#f1f5f9',color:dark?'#fff':'#0a1628',minHeight:'100vh',padding:'16px'}}>
      <div style={{maxWidth:'380px',margin:'auto',background:dark?'#111f3a':'#fff',padding:'24px',borderRadius:'16px',textAlign:'center'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2 style={{margin:0}}>🔐 2FA Authenticator</h2>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{width:'40px',height:'32px',borderRadius:'8px',cursor:'pointer',background:dark?'#1e293b':'#fff',border:'1px solid #475569'}}>🌙</button>
        </div>
        <p style={{color:'#94a3b8',fontSize:'13px'}}>Enter 6-digit code from authenticator app</p>
        <div style={{display:'flex',gap:'8px',justifyContent:'center',margin:'12px 0'}}>
          {code.map((d,i)=><input key={i} value={d} onChange={e=>set(i,e.target.value)} maxLength={1} style={otpStyle} />)}
        </div>
        <button onClick={()=>setMsg('2FA verified successfully')} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#2563eb',color:'#fff',fontWeight:'bold'}}>Verify</button>
        {msg&&<p style={{color:'#16a34a'}}>{msg}</p>}
      </div>
    </div>
  );
}
