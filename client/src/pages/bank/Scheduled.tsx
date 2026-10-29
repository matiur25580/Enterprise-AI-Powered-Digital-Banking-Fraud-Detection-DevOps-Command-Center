import { useState } from 'react';
const s={width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',border:'1px solid #334155',boxSizing:'border-box' as const};
export default function Scheduled(){
  const [msg,setMsg]=useState('');
  return(<div style={{padding:'20px',maxWidth:'480px',margin:'auto'}}><h2>📅 Scheduled Payments</h2>
  <input placeholder="Amount" type="number" style={s} />
  <input type="date" style={s} />
  <select style={s}><option>Monthly</option><option>Weekly</option><option>Once</option></select>
  <button onClick={()=>setMsg('Scheduled payment created')} style={{...s,background:'#7c3aed',color:'#fff',border:'none',fontWeight:'bold'}}>Schedule</button>
  {msg&&<p style={{color:'#16a34a'}}>{msg}</p>}</div>);
}
