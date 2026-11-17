import { useState, useEffect } from 'react';
import { getDateTime } from './dateHelper';
import SuccessToast from '../components/SuccessToast';
export default function Admin() {
  const [theme, setTheme] = useState('dark');
  const [dt, setDt] = useState(getDateTime());
  const [user] = useState(()=>{ try{ return JSON.parse(localStorage.getItem('trustshield_user')||'{}'); }catch(e){ return {}; } });
  const [msg, setMsg] = useState('');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({total:0, customers:0, admins:0});
  const toggleSuspend=(email:string)=>{ setMsg('Suspension changes require the secured admin API.'); };
  const changeRole=(email:string, newRole:string)=>{ setMsg('Role changes require the secured admin API.'); };
  const dark = theme==='dark';
  const card={background:dark?'#111f3a':'#fff',padding:'20px',borderRadius:'16px',margin:'12px 0',boxShadow:'0 4px 12px rgba(0,0,0,0.2)'};
  const stat={flex:1,minWidth:'140px',background:dark?'#1e293b':'#f1f5f9',padding:'16px',borderRadius:'12px',textAlign:'center' as const};
  useEffect(()=>{ const t=setInterval(()=>setDt(getDateTime()),1000); return ()=>clearInterval(t); },[]);
  useEffect(()=>{
    const api=(import.meta as any).env.VITE_API_URL||'http://localhost:5000';
    const token=localStorage.getItem('trustshield_token');
    if(!token || user.role!=='Admin'){ window.location.href='/login'; return; }
    fetch(api+'/api/auth/admin/users',{headers:{Authorization:'Bearer '+token}})
      .then(r=>{ if(r.status===401||r.status===403){window.location.href='/login';return [];} return r.json(); })
      .then(d=>{ if(Array.isArray(d)){ setUsers(d); setStats({total:d.length, customers:d.filter((u:any)=>u.role==='Customer').length, admins:d.filter((u:any)=>u.role==='Admin').length}); } })
      .catch(()=>{});
  },[]);
  return (
    <div style={{ background: dark?'#0a0a0a':'#f1f5f9', color: dark?'#fff':'#000', minHeight:'100vh', padding:'20px' }}>
      <SuccessToast msg={msg} onClose={()=>setMsg('')} />
      {user.uid && <div>UID: {user.uid}</div>}
      <div style={{ background:'linear-gradient(90deg,#dc2626,#991b1b)', color:'#fff', padding:'14px', textAlign:'center', fontWeight:'bold', fontSize:'20px', borderRadius:'12px' }}>🛡️ ADMIN COMMAND CENTER</div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'10px', flexWrap:'wrap' }}>
        <div><p>Date: {dt.dateStr}</p><p>Time: {dt.timeStr}</p></div>
        <div>
          <button onClick={()=>{localStorage.removeItem('trustshield_token');localStorage.removeItem('trustshield_user');window.location.href='/login';}} style={{marginRight:'10px',padding:'8px 16px',borderRadius:'8px'}}>Logout</button>
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
          <button onClick={()=>setMsg('Staff list loaded: '+users.length+' users')} style={{flex:1,padding:'12px',borderRadius:'10px',border:'none',background:'#2563eb',color:'#fff',fontWeight:'bold'}}>👥 Manage Staff</button>
          <button onClick={()=>{const csv='Email,Role,UID\n'+users.map((u:any)=>u.email+','+u.role+','+u.uid).join('\n'); const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='audit.csv'; a.click(); setMsg('Audit log exported');}} style={{flex:1,padding:'12px',borderRadius:'10px',border:'none',background:'#16a34a',color:'#fff',fontWeight:'bold'}}>📋 Export Audit</button>
          <button onClick={()=>setMsg('Compliance: '+stats.total+' total users, '+stats.customers+' customers, '+stats.admins+' admins - Report generated')} style={{flex:1,padding:'12px',borderRadius:'10px',border:'none',background:'#7c3aed',color:'#fff',fontWeight:'bold'}}>📊 Compliance</button>
        </div>
      </div>
      <div style={card}>
        <h3>User Management ({users.length})</h3>
        <div style={{display:'flex',gap:'10px',marginBottom:'10px'}}>
          <div style={{flex:1,padding:'12px',background:dark?'#1e3a5f':'#dbeafe',borderRadius:'10px',textAlign:'center',color:dark?'#ffffff':'#000000'}}><b>{stats.total}</b><br/>Total Users</div>
          <div style={{flex:1,padding:'12px',background:dark?'#14532d':'#dcfce7',borderRadius:'10px',textAlign:'center',color:dark?'#ffffff':'#000000'}}><b>{stats.customers}</b><br/>Customers</div>
          <div style={{flex:1,padding:'12px',background:dark?'#78350f':'#fef3c7',borderRadius:'10px',textAlign:'center',color:dark?'#ffffff':'#000000'}}><b>{stats.admins}</b><br/>Admins</div>
        </div>
        <table style={{width:'100%',fontSize:'12px',borderCollapse:'collapse',color:dark?'#ffffff':'#000000'}}>
          <thead><tr><th>Email</th><th>Role</th><th>UID</th></tr></thead>
          <tbody>{users.map((u:any,i:number)=><tr key={i} style={{borderTop:'1px solid #eee'}}><td>{u.email}</td><td>{u.role}</td><td>{u.uid}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
