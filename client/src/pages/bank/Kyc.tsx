import { useState } from 'react';
const s={width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',border:'1px solid #334155',boxSizing:'border-box' as const};
export default function Kyc(){
  const [msg,setMsg]=useState('');
  return(<div style={{padding:'20px',maxWidth:'480px',margin:'auto'}}><h2>🆔 KYC Verification</h2>
  <select style={s}><option>Aadhaar Card</option><option>PAN Card</option><option>Passport</option></select>
  <input placeholder="Document Number" style={s} />
  <input type="file" style={s} />
  <button onClick={()=>setMsg('KYC document uploaded successfully')} style={{...s,background:'#2563eb',color:'#fff',border:'none',fontWeight:'bold'}}>Upload</button>
  {msg&&<p style={{color:'#16a34a'}}>{msg}</p>}</div>);
}
