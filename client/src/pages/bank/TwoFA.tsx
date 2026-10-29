import { useState } from 'react';
export default function TwoFA(){
  const [code,setCode]=useState(['','','','','','']);
  const [msg,setMsg]=useState('');
  const set=(i:number,v:string)=>{const n=[...code];n[i]=v.slice(-1);setCode(n);};
  return(<div style={{padding:'20px',maxWidth:'380px',margin:'auto',textAlign:'center'}}><h2>🔐 2FA Authenticator</h2>
  <p style={{color:'#94a3b8',fontSize:'13px'}}>Enter 6-digit code from authenticator app</p>
  <div style={{display:'flex',gap:'8px',justifyContent:'center',margin:'12px 0'}}>
  {code.map((d,i)=><input key={i} value={d} onChange={e=>set(i,e.target.value)} maxLength={1} style={{width:'44px',height:'48px',textAlign:'center',fontSize:'18px',borderRadius:'10px',border:'1px solid #334155'}} />)}
  </div>
  <button onClick={()=>setMsg('2FA verified successfully')} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#16a34a',color:'#fff',fontWeight:'bold'}}>Verify</button>
  {msg&&<p style={{color:'#16a34a'}}>{msg}</p>}</div>);
}
