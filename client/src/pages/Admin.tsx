import { useState, useEffect } from 'react';
import { getDateTime } from './dateHelper';
import SuccessToast from '../components/SuccessToast';
export default function Admin() {
  const [theme, setTheme] = useState('dark');
  const [dt, setDt] = useState(getDateTime());
  const [msg, setMsg] = useState('');
  const dark = theme==='dark';
  const card={background:dark?'#111f3a':'#fff',padding:'20px',borderRadius:'16px',margin:'12px 0',boxShadow:'0 4px 12px rgba(0,0,0,0.2)'};
  const stat={flex:1,minWidth:'140px',background:dark?'#1e293b':'#f1f5f9',padding:'16px',borderRadius:'12px',textAlign:'center' as const};
  useEffect(()=>{ const t=setInterval(()=>setDt(getDateTime()),1000); return ()=>clearInterval(t); },[]);
  return (
    <div style={{ background: dark?'#0a0a0a':'#f1f5f9', color: dark?'#fff':'#000', minHeight:'100vh', padding:'20px' }}>
      <SuccessToast msg={msg} onClose={()=>setMsg('')} />
      <div style={{ background:'linear-gradient(90deg,#dc2626,#991b1b)', color:'#fff', padding:'14px', textAlign:'center', fontWeight:'bold', fontSize:'20px', borderRadius:'12px' }}>🛡️ ADMIN COMMAND CENTER</div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'10px', flexWrap:'wrap' }}>
        <div><p>Date: {dt.dateStr}</p><p>Time: {dt.timeStr}</p></div>
        <div>
          <button onClick={()=>{localStorage.removeItem('token'); window.location.href='/login';}} style={{marginRight:'10px',padding:'8px 16px',borderRadius:'8px'}}>Logout</button>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{padding:'8px 16px',borderRadius:'8px'}}>🌙/☀️</button>
        </div>
      </div>
      <div style={{display:'flex',gap:'12px',flexWrap:'wrap',margin:'12px 0'}}>
        <div style={stat}><h3 style={{margin:0,color:'#2563eb'}}>2,847</h3><p style={{margin:0,fontSize:'12px'}}>Total Users</p></div>
        <div style={stat}><h3 style={{margin:0,color:'#16a34a'}}>.2M</h3><p style={{margin:0,fontSize:'12px'}}>Total Volume</p></div>
        <div style={stat}><h3 style={{margin:0,color:'#dc2626'}}>12</h3><p style={{margin:0,fontSize:'12px'}}>Fraud Alerts</p></div>
        <div style={stat}><h3 style={{margin:0,color:'#7c3aed'}}>99.9%</h3><p style={{margin:0,fontSize:'12px'}}>Uptime</p></div>
      </div>
      <div style={card}>
        <h3>🏦 Branch Performance</h3>
        <p>📍 Kolkata Main — .8M • 24 staff • <span style={{color:'#16a34a'}}>▲ 12%</span></p>
        <p>📍 Delhi South — .2M • 18 staff • <span style={{color:'#16a34a'}}>▲ 8%</span></p>
        <p>📍 Mumbai West — .2M • 21 staff • <span style={{color:'#dc2626'}}>▼ 3%</span></p>
      </div>
      <div style={card}>
        <h3>⚡ Quick Actions</h3>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
          <button onClick={()=>window.location.href='/staff'} style={{flex:1,padding:'12px',borderRadius:'10px',border:'none',background:'#2563eb',color:'#fff',fontWeight:'bold'}}>👥 Manage Staff</button>
          <button onClick={()=>setMsg('Audit log exported successfully')} style={{flex:1,padding:'12px',borderRadius:'10px',border:'none',background:'#16a34a',color:'#fff',fontWeight:'bold'}}>📋 Export Audit</button>
          <button onClick={()=>setMsg('Compliance report generated')} style={{flex:1,padding:'12px',borderRadius:'10px',border:'none',background:'#7c3aed',color:'#fff',fontWeight:'bold'}}>📊 Compliance</button>
        </div>
      </div>
    </div>
  );
}
