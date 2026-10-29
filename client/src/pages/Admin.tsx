import { useState, useEffect } from 'react';
import { getDateTime } from './dateHelper';
import SuccessToast from '../components/SuccessToast';
export default function Admin() {
  const [theme, setTheme] = useState('dark');
  const [dt, setDt] = useState(getDateTime());
  const [msg, setMsg] = useState('');
  const dark = theme==='dark';
  const s={width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',fontSize:'14px',boxSizing:'border-box' as const,
    background:dark?'#1e293b':'#ffffff',color:dark?'#ffffff':'#000000',border:dark?'1px solid #475569':'1px solid #cbd5e1'};
  const card={background:dark?'#111f3a':'#fff',padding:'20px',borderRadius:'16px',margin:'12px 0'};
  useEffect(()=>{ const t=setInterval(()=>setDt(getDateTime()),1000); return ()=>clearInterval(t); },[]);
  const branches=[
    {id:'BR001',name:'Kolkata Main',staff:24},
    {id:'BR002',name:'Delhi South',staff:18},
  ];
  return (
    <div style={{ background: dark?'#0a0a0a':'#f1f5f9', color: dark?'#fff':'#000', minHeight:'100vh', padding:'20px' }}>
      <SuccessToast msg={msg} onClose={()=>setMsg('')} />
      <div style={{ background:'#dc2626', color:'#fff', padding:'10px', textAlign:'center', fontWeight:'bold', fontSize:'20px', borderRadius:'10px' }}>ROLE: ADMIN</div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'10px', flexWrap:'wrap' }}>
        <div><p>Date: {dt.dateStr}</p><p>Time: {dt.timeStr}</p></div>
        <div>
          <button onClick={()=>{localStorage.removeItem('token'); window.location.href='/login';}} style={{marginRight:'10px',padding:'8px 16px',borderRadius:'8px'}}>Logout</button>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{padding:'8px 16px',borderRadius:'8px'}}>🌙/☀️</button>
        </div>
      </div>
      <div style={card}>
        <h3>👥 Staff Management</h3>
        <button onClick={()=>window.location.href='/staff'} style={{...s,background:'#2563eb',color:'#fff',border:'none',fontWeight:'bold'}}>Manage Staff</button>
      </div>
      <div style={card}>
        <h3>🏦 Branches</h3>
        {branches.map(b=><div key={b.id} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #334155'}}>
          <div><b>{b.name}</b><br/><span style={{fontSize:'12px',color:'#94a3b8'}}>{b.id} • {b.staff} staff</span></div>
          <button onClick={()=>setMsg('Branch '+b.name+' updated')} style={{padding:'8px 16px',borderRadius:'8px',border:'none',background:'#7c3aed',color:'#fff'}}>Manage</button>
        </div>)}
      </div>
      <div style={card}>
        <h3>📋 System Health</h3>
        <p>✅ MongoDB: Connected • ✅ Server: Live • ✅ Uptime: 99.9%</p>
        <button onClick={()=>setMsg('Audit log exported successfully')} style={{...s,background:'#16a34a',color:'#fff',border:'none',fontWeight:'bold'}}>Export Audit Log</button>
      </div>
    </div>
  );
}
