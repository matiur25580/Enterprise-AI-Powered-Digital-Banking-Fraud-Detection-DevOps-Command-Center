import { useState, useEffect } from 'react';
import { getDateTime } from './dateHelper';
import SuccessToast from '../components/SuccessToast';
export default function RiskManager() {
  const [theme, setTheme] = useState('dark');
  const [dt, setDt] = useState(getDateTime());
  const [msg, setMsg] = useState('');
  const dark = theme==='dark';
  const card={background:dark?'#111f3a':'#fff',padding:'20px',borderRadius:'16px',margin:'12px 0'};
  const stat={flex:1,minWidth:'120px',background:dark?'#1e293b':'#f1f5f9',padding:'14px',borderRadius:'12px',textAlign:'center' as const};
  useEffect(()=>{ const t=setInterval(()=>setDt(getDateTime()),1000); return ()=>clearInterval(t); },[]);
  const alerts=[
    {id:'TXN991',amt:',800',score:92,user:'unknown@mail.com',reason:'Unusual location'},
    {id:'TXN992',amt:',200',score:87,user:'test@mail.com',reason:'Velocity spike'},
    {id:'TXN993',amt:',500',score:76,user:'demo@mail.com',reason:'New device'},
  ];
  const bar=(score:number)=><div style={{width:'100px',height:'8px',background:'#334155',borderRadius:'4px'}}><div style={{width:score+'%',height:'100%',background:score>85?'#dc2626':score>75?'#f59e0b':'#16a34a',borderRadius:'4px'}} /></div>;
  return (
    <div style={{ background: dark?'#0a0a0a':'#f1f5f9', color: dark?'#fff':'#000', minHeight:'100vh', padding:'20px' }}>
      <SuccessToast msg={msg} onClose={()=>setMsg('')} />
      <div style={{ background:'linear-gradient(90deg,#7c3aed,#4c1d95)', color:'#fff', padding:'14px', textAlign:'center', fontWeight:'bold', fontSize:'20px', borderRadius:'12px' }}>🤖 AI FRAUD INTELLIGENCE</div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'10px', flexWrap:'wrap' }}>
        <div><p>Date: {dt.dateStr}</p><p>Time: {dt.timeStr}</p></div>
        <div>
          <button onClick={()=>{localStorage.removeItem('token'); window.location.href='/login';}} style={{marginRight:'10px',padding:'8px 16px',borderRadius:'8px'}}>Logout</button>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{padding:'8px 16px',borderRadius:'8px'}}>🌙/☀️</button>
        </div>
      </div>
      <div style={{display:'flex',gap:'12px',flexWrap:'wrap',margin:'12px 0'}}>
        <div style={stat}><h3 style={{margin:0,color:'#dc2626'}}>12</h3><p style={{margin:0,fontSize:'12px'}}>Critical Alerts</p></div>
        <div style={stat}><h3 style={{margin:0,color:'#f59e0b'}}>34</h3><p style={{margin:0,fontSize:'12px'}}>Under Review</p></div>
        <div style={stat}><h3 style={{margin:0,color:'#16a34a'}}>1,248</h3><p style={{margin:0,fontSize:'12px'}}>Auto Approved</p></div>
        <div style={stat}><h3 style={{margin:0,color:'#2563eb'}}>98.2%</h3><p style={{margin:0,fontSize:'12px'}}>AI Accuracy</p></div>
      </div>
      <div style={card}>
        <h3>🚨 Live Fraud Alerts — AI Scored</h3>
        {alerts.map(a=><div key={a.id} style={{padding:'12px 0',borderBottom:'1px solid #334155'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div><b>{a.id}</b> • {a.amt}<br/><span style={{fontSize:'12px',color:'#94a3b8'}}>{a.user} • {a.reason}</span></div>
            <div style={{textAlign:'right'}}><b style={{color:'#dc2626'}}>{a.score}</b>{bar(a.score)}</div>
          </div>
          <div style={{marginTop:'8px'}}>
            <button onClick={()=>setMsg('Transaction '+a.id+' blocked and reported')} style={{padding:'8px 16px',borderRadius:'8px',border:'none',background:'#dc2626',color:'#fff',marginRight:'8px'}}>⛔ Block</button>
            <button onClick={()=>setMsg('Transaction '+a.id+' approved as legitimate')} style={{padding:'8px 16px',borderRadius:'8px',border:'none',background:'#16a34a',color:'#fff'}}>✅ Approve</button>
          </div>
        </div>)}
      </div>
    </div>
  );
}
