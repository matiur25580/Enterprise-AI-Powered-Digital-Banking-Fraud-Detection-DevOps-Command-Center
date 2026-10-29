import { useState } from 'react';
const s={width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',border:'1px solid #334155',boxSizing:'border-box' as const};
export default function Disputes(){
  const [msg,setMsg]=useState('');
  return(<div style={{padding:'20px',maxWidth:'480px',margin:'auto'}}><h2>⚠️ Dispute / Chargeback</h2>
  <input placeholder="Transaction ID" style={s} />
  <select style={s}><option>Wrong amount</option><option>Fraud</option><option>Not received</option></select>
  <textarea placeholder="Describe issue" style={{...s,height:'80px'}} />
  <button onClick={()=>setMsg('Dispute raised successfully. Ticket ID: DSP'+Date.now())} style={{...s,background:'#dc2626',color:'#fff',border:'none',fontWeight:'bold'}}>Raise Dispute</button>
  {msg&&<p style={{color:'#16a34a'}}>{msg}</p>}</div>);
}
