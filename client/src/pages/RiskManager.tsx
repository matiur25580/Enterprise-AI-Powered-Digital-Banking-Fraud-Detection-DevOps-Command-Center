import { useState, useEffect } from 'react';
import { getDateTime } from './dateHelper';
import SuccessToast from '../components/SuccessToast';
export default function RiskManager() {
  const [theme, setTheme] = useState('dark');
  const [dt, setDt] = useState(getDateTime());
  const [msg, setMsg] = useState('');
  const dark = theme==='dark';
  const card={background:dark?'#111f3a':'#fff',padding:'20px',borderRadius:'16px',margin:'12px 0'};
  useEffect(()=>{ const t=setInterval(()=>setDt(getDateTime()),1000); return ()=>clearInterval(t); },[]);
  const alerts=[
    {id:'TXN991',amt:',800',score:92,user:'unknown@mail.com'},
    {id:'TXN992',amt:',200',score:87,user:'test@mail.com'},
    {id:'TXN993',amt:',500',score:76,user:'demo@mail.com'},
  ];
  return (
    <div style={{ background: dark?'#0a0a0a':'#f1f5f9', color: dark?'#fff':'#000', minHeight:'100vh', padding:'20px' }}>
      <SuccessToast msg={msg} onClose={()=>setMsg('')} />
      <div style={{ background:'#7c3aed', color:'#fff', padding:'10px', textAlign:'center', fontWeight:'bold', fontSize:'20px', borderRadius:'10px' }}>ROLE: RISK MANAGER</div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'10px', flexWrap:'wrap' }}>
        <div><p>Date: {dt.dateStr}</p><p>Time: {dt.timeStr}</p></div>
        <div>
          <button onClick={()=>{localStorage.removeItem('token'); window.location.href='/login';}} style={{marginRight:'10px',padding:'8px 16px',borderRadius:'8px'}}>Logout</button>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{padding:'8px 16px',borderRadius:'8px'}}>🌙/☀️</button>
        </div>
      </div>
      <div style={card}>
        <h3>🚨 Live Fraud Alerts</h3>
        {alerts.map(a=><div key={a.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid #334155'}}>
          <div><b>{a.id}</b> • {a.amt}<br/><span style={{fontSize:'12px',color:'#94a3b8'}}>{a.user} • Risk Score: </span><b style={{color:'#dc2626'}}>{a.score}</b></div>
          <div>
            <button onClick={()=>setMsg('Transaction '+a.id+' blocked')} style={{padding:'8px 12px',borderRadius:'8px',border:'none',background:'#dc2626',color:'#fff',marginRight:'6px'}}>Block</button>
            <button onClick={()=>setMsg('Transaction '+a.id+' approved')} style={{padding:'8px 12px',borderRadius:'8px',border:'none',background:'#16a34a',color:'#fff'}}>Approve</button>
          </div>
        </div>)}
      </div>
      <div style={card}>
        <h3>📊 AI Risk Overview</h3>
        <p>Today blocked: <b style={{color:'#dc2626'}}>12</b> • Approved: <b style={{color:'#16a34a'}}>1,248</b></p>
        <p style={{fontSize:'13px',color:'#94a3b8'}}>Large transfers pending approval: 3</p>
        <button onClick={()=>setMsg('Large transfer approved successfully')} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#2563eb',color:'#fff',fontWeight:'bold'}}>Review Large Transfers</button>
      </div>
    </div>
  );
}
