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
  useEffect(()=>{ const t=setInterval(()=>setDt(getDateTime()),1000); return ()=>clearInterval(t); },[]);
  const tickets=[
    {id:'DSP172901',user:'rahul@mail.com',issue:'Wrong amount',status:'Open'},
    {id:'DSP172902',user:'priya@mail.com',issue:'Fraud',status:'Open'},
  ];
  const kycs=[
    {id:'KYC001',user:'amit@mail.com',doc:'Aadhaar',status:'Pending'},
    {id:'KYC002',user:'sara@mail.com',doc:'PAN',status:'Pending'},
  ];
  return (
    <div style={{ background: dark?'#0a0a0a':'#f1f5f9', color: dark?'#fff':'#000', minHeight:'100vh', padding:'20px' }}>
      <SuccessToast msg={msg} onClose={()=>setMsg('')} />
      <div style={{ background:'#0284c7', color:'#fff', padding:'10px', textAlign:'center', fontWeight:'bold', fontSize:'20px', borderRadius:'10px' }}>ROLE: SUPPORT AGENT</div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'10px', flexWrap:'wrap' }}>
        <div><p>Date: {dt.dateStr}</p><p>Time: {dt.timeStr}</p></div>
        <div>
          <button onClick={()=>{localStorage.removeItem('token'); window.location.href='/login';}} style={{marginRight:'10px',padding:'8px 16px',borderRadius:'8px'}}>Logout</button>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{padding:'8px 16px',borderRadius:'8px'}}>🌙/☀️</button>
        </div>
      </div>
      <div style={card}>
        <h3>🔍 Customer Search</h3>
        <input placeholder="Search by email" value={search} onChange={e=>setSearch(e.target.value)} style={s} />
        <button onClick={()=>setMsg('Customer found: '+search)} style={{...s,background:'#2563eb',color:'#fff',border:'none',fontWeight:'bold'}}>Search</button>
      </div>
      <div style={card}>
        <h3>🎫 Dispute Tickets</h3>
        {tickets.map(t=><div key={t.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #334155'}}>
          <div><b>{t.id}</b><br/><span style={{fontSize:'12px',color:'#94a3b8'}}>{t.user} • {t.issue}</span></div>
          <button onClick={()=>setMsg('Ticket '+t.id+' resolved successfully')} style={{padding:'8px 16px',borderRadius:'8px',border:'none',background:'#16a34a',color:'#fff'}}>Resolve</button>
        </div>)}
      </div>
      <div style={card}>
        <h3>🆔 KYC Verification</h3>
        {kycs.map(k=><div key={k.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #334155'}}>
          <div><b>{k.id}</b><br/><span style={{fontSize:'12px',color:'#94a3b8'}}>{k.user} • {k.doc}</span></div>
          <button onClick={()=>setMsg('KYC '+k.id+' verified successfully')} style={{padding:'8px 16px',borderRadius:'8px',border:'none',background:'#7c3aed',color:'#fff'}}>Verify</button>
        </div>)}
      </div>
    </div>
  );
}
