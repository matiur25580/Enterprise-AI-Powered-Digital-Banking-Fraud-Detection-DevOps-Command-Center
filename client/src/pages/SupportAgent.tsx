import { useState, useEffect } from 'react';
import { getDateTime } from './dateHelper';
import SuccessToast from '../components/SuccessToast';
export default function SupportAgent() {
  const [theme, setTheme] = useState('dark');
  const [dt, setDt] = useState(getDateTime());
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');
  const dark = theme==='dark';
  const s={width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',fontSize:'14px',boxSizing:'border-box' as const,
    background:dark?'#1e293b':'#ffffff',color:dark?'#ffffff':'#000000',border:dark?'1px solid #475569':'1px solid #cbd5e1'};
  const card={background:dark?'#111f3a':'#fff',padding:'20px',borderRadius:'16px',margin:'12px 0'};
  const stat={flex:1,minWidth:'120px',background:dark?'#1e293b':'#f1f5f9',padding:'14px',borderRadius:'12px',textAlign:'center' as const};
  useEffect(()=>{ const t=setInterval(()=>setDt(getDateTime()),1000); return ()=>clearInterval(t); },[]);
  return (
    <div style={{ background: dark?'#0a0a0a':'#f1f5f9', color: dark?'#fff':'#000', minHeight:'100vh', padding:'20px' }}>
      <SuccessToast msg={msg} onClose={()=>setMsg('')} />
      <div style={{ background:'linear-gradient(90deg,#0284c7,#0c4a6e)', color:'#fff', padding:'14px', textAlign:'center', fontWeight:'bold', fontSize:'20px', borderRadius:'12px' }}>🎧 CUSTOMER CARE PRO</div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'10px', flexWrap:'wrap' }}>
        <div><p>Date: {dt.dateStr}</p><p>Time: {dt.timeStr}</p></div>
        <div>
          <button onClick={()=>{localStorage.removeItem('token'); window.location.href='/login';}} style={{marginRight:'10px',padding:'8px 16px',borderRadius:'8px'}}>Logout</button>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{padding:'8px 16px',borderRadius:'8px'}}>🌙/☀️</button>
        </div>
      </div>
      <div style={{display:'flex',gap:'12px',flexWrap:'wrap',margin:'12px 0'}}>
        <div style={stat}><h3 style={{margin:0,color:'#f59e0b'}}>18</h3><p style={{margin:0,fontSize:'12px'}}>Open Tickets</p></div>
        <div style={stat}><h3 style={{margin:0,color:'#16a34a'}}>142</h3><p style={{margin:0,fontSize:'12px'}}>Resolved Today</p></div>
        <div style={stat}><h3 style={{margin:0,color:'#2563eb'}}>4.8⭐</h3><p style={{margin:0,fontSize:'12px'}}>CSAT Score</p></div>
        <div style={stat}><h3 style={{margin:0,color:'#7c3aed'}}>2m</h3><p style={{margin:0,fontSize:'12px'}}>Avg Response</p></div>
      </div>
      <div style={card}>
        <h3>🔍 360° Customer Search</h3>
        <input placeholder="Search by email / UID / phone" value={search} onChange={e=>setSearch(e.target.value)} style={s} />
        <button onClick={()=>setMsg('Customer profile loaded: '+search)} style={{...s,background:'#2563eb',color:'#fff',border:'none',fontWeight:'bold'}}>Search Customer</button>
      </div>
      <div style={card}>
        <h3>🎫 Priority Tickets</h3>
        <p>🔴 <b>DSP172901</b> — Wrong amount 00 • rahul@mail.com <button onClick={()=>setMsg('Ticket DSP172901 resolved')} style={{marginLeft:'8px',padding:'6px 12px',borderRadius:'6px',border:'none',background:'#16a34a',color:'#fff'}}>Resolve</button></p>
        <p>🟡 <b>DSP172902</b> — Fraud alert • priya@mail.com <button onClick={()=>setMsg('Ticket DSP172902 escalated to Risk')} style={{marginLeft:'8px',padding:'6px 12px',borderRadius:'6px',border:'none',background:'#f59e0b',color:'#fff'}}>Escalate</button></p>
        <p>🟢 <b>KYC001</b> — Aadhaar pending • amit@mail.com <button onClick={()=>setMsg('KYC KYC001 verified')} style={{marginLeft:'8px',padding:'6px 12px',borderRadius:'6px',border:'none',background:'#7c3aed',color:'#fff'}}>Verify KYC</button></p>
      </div>
    </div>
  );
}
