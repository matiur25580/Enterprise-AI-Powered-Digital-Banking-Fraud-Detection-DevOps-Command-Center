import { useState } from 'react';
const s={width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',border:'1px solid #334155',boxSizing:'border-box' as const};
export default function Staff(){
  const [msg,setMsg]=useState('');
  return(<div style={{padding:'20px',maxWidth:'480px',margin:'auto'}}><h2>👥 Staff Management</h2>
  <input placeholder="Staff Name" style={s} />
  <input placeholder="Email" style={s} />
  <select style={s}><option>SupportAgent</option><option>RiskManager</option><option>BranchManager</option></select>
  <button onClick={()=>setMsg('Staff created successfully')} style={{...s,background:'#16a34a',color:'#fff',border:'none',fontWeight:'bold'}}>Create Staff</button>
  {msg&&<p style={{color:'#16a34a'}}>{msg}</p>}</div>);
}
