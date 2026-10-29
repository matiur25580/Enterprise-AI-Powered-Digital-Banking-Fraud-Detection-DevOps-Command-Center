import { useState } from 'react';
export default function Kyc(){
  const [theme,setTheme]=useState('dark');
  const [msg,setMsg]=useState('');
  const dark=theme==='dark';
  const s={width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',fontSize:'14px',boxSizing:'border-box' as const,
    background:dark?'#1e293b':'#ffffff',color:dark?'#ffffff':'#000000',border:dark?'1px solid #475569':'1px solid #cbd5e1'};
  return(
    <div style={{background:dark?'#0a1628':'#f1f5f9',color:dark?'#fff':'#0a1628',minHeight:'100vh',padding:'16px'}}>
      <div style={{maxWidth:'480px',margin:'auto',background:dark?'#111f3a':'#fff',padding:'24px',borderRadius:'16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2 style={{margin:0}}>🆔 KYC Verification</h2>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{width:'40px',height:'32px',borderRadius:'8px',cursor:'pointer',background:dark?'#1e293b':'#fff',border:'1px solid #475569'}}>🌙</button>
        </div>
        <select style={s}><option>Aadhaar Card</option><option>PAN Card</option><option>Passport</option></select>
        <input placeholder="Document Number" style={s} />
        <input type="file" style={s} />
        <button onClick={()=>setMsg('KYC document uploaded successfully')} style={{...s,background:'#2563eb',color:'#fff',border:'none',fontWeight:'bold'}}>Upload</button>
        {msg&&<p style={{color:'#16a34a'}}>{msg}</p>}
      </div>
    </div>
  );
}
