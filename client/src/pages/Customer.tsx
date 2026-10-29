import { useState, useEffect } from 'react';
import { getDateTime } from './dateHelper';
import SuccessToast from '../components/SuccessToast';
export default function Customer() {
  const [theme, setTheme] = useState('dark');
  const [dt, setDt] = useState(getDateTime());
  const [user] = useState(()=>{ try{ return JSON.parse(localStorage.getItem('trustshield_user')||'{}'); }catch(e){ return {}; } });
  const [msg, setMsg] = useState('');
  const [toAcc, setToAcc] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(25480.50);
  const [txns, setTxns] = useState([{id:'TXN001',to:'John Doe',amt:500,date:'2026-10-28',status:'Completed'},{id:'TXN002',to:'Amazon',amt:120,date:'2026-10-27',status:'Completed'}]);
  const dark = theme==='dark';
  const s={width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',fontSize:'14px',boxSizing:'border-box' as const,
    background:dark?'#1e293b':'#ffffff',color:dark?'#ffffff':'#000000',border:dark?'1px solid #475569':'1px solid #cbd5e1'};
  const card={background:dark?'#111f3a':'#fff',padding:'20px',borderRadius:'16px',margin:'12px 0',boxShadow:'0 4px 12px rgba(0,0,0,0.2)'};
  useEffect(()=>{ const t=setInterval(()=>setDt(getDateTime()),1000); return ()=>clearInterval(t); },[]);
  return (
    <div style={{ background: dark?'#0a0a0a':'#f1f5f9', color: dark?'#fff':'#000', minHeight:'100vh', padding:'20px' }}>
      <SuccessToast msg={msg} onClose={()=>setMsg('')} />
      {user.uid && <div>UID: {user.uid}</div>}
      <div style={{ background:'linear-gradient(135deg,#16a34a,#065f46)', color:'#fff', padding:'20px', borderRadius:'16px' }}>
        <p style={{margin:0,fontSize:'13px',opacity:0.9}}>Total Balance</p>
        <h1 style={{margin:'4px 0'}}>{balance.toFixed(2)}</h1>
        <p style={{margin:0,fontSize:'13px'}}>💳 •• 4521 • Savings • <span style={{background:'rgba(255,255,255,0.2)',padding:'2px 8px',borderRadius:'12px'}}>Verified ✓</span></p>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'10px', flexWrap:'wrap' }}>
        <div><p style={{fontSize:'12px'}}>Date: {dt.dateStr} • {dt.timeStr}</p></div>
        <div>
          <button onClick={()=>{localStorage.removeItem('token'); window.location.href='/login';}} style={{marginRight:'8px',padding:'8px 14px',borderRadius:'8px'}}>Logout</button>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{padding:'8px 14px',borderRadius:'8px'}}>🌙/☀️</button>
        </div>
      </div>
      <div style={{display:'flex',gap:'10px',margin:'12px 0'}}>
        <div style={{flex:1,background:dark?'#1e293b':'#fff',padding:'14px',borderRadius:'12px',textAlign:'center'}}><div style={{fontSize:'24px'}}>💸</div><p style={{margin:'4px 0',fontSize:'12px',fontWeight:'bold'}}>Transfer</p></div>
        <div style={{flex:1,background:dark?'#1e293b':'#fff',padding:'14px',borderRadius:'12px',textAlign:'center'}}><div style={{fontSize:'24px'}}>📊</div><p style={{margin:'4px 0',fontSize:'12px',fontWeight:'bold'}}>Credit 782</p></div>
        <div style={{flex:1,background:dark?'#1e293b':'#fff',padding:'14px',borderRadius:'12px',textAlign:'center'}}><div style={{fontSize:'24px'}}>🎯</div><p style={{margin:'4px 0',fontSize:'12px',fontWeight:'bold'}}>Goals 68%</p></div>
      </div>
      <div style={card}>
        <h3>💸 Instant Transfer</h3>
        <input placeholder="To Account / UPI ID" value={toAcc} onChange={e=>setToAcc(e.target.value)} style={s} />
        <input placeholder="Amount $" type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={s} />
        <button onClick={()=>{if(!toAcc||!amount){setMsg('Enter details');return;} const amt=parseFloat(amount); if(amt>balance){setMsg('Insufficient balance');return;} setBalance(b=>b-amt); setTxns([{id:'TXN'+String(txns.length+1).padStart(3,'0'),to:toAcc,amt:amt,date:new Date().toISOString().split('T')[0],status:'Completed'},...txns]); setMsg('Transfer of $'+amt+' to '+toAcc+' successful'); setToAcc(''); setAmount('');}} style={{...s,background:'#2563eb',color:'#fff',border:'none',fontWeight:'bold'}}>Send Money</button>
      </div>
      <div style={card}>
        <h3>📜 Smart Insights</h3>
        <p>☕ Food & Dining — <b>20</b> <span style={{color:'#dc2626',fontSize:'12px'}}>↑ 15%</span></p>
        <p>🚗 Transport — <b>80</b> <span style={{color:'#16a34a',fontSize:'12px'}}>↓ 8%</span></p>
        <p>💡 AI Tip: <span style={{fontSize:'13px',color:'#94a3b8'}}>Move 00 to savings to reach goal 2 weeks early</span></p>
        <button onClick={()=>{const csv='ID,To,Amount,Date,Status\n'+txns.map(x=>x.id+','+x.to+','+x.amt+','+x.date+','+x.status).join('\n'); const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='statement.csv'; a.click(); setMsg('Statement downloaded');}} style={{...s,background:'#7c3aed',color:'#fff',border:'none',fontWeight:'bold'}}>📥 Download Statement</button>
      </div>
    </div>
  );
}
