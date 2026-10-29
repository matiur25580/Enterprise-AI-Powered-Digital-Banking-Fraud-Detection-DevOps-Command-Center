import { useState, useEffect } from 'react';
import { getDateTime } from './dateHelper';
import SuccessToast from '../components/SuccessToast';
export default function SupportAgent() {
  const [theme, setTheme] = useState('dark');
  const [dt, setDt] = useState(getDateTime());
  const [user] = useState(()=>{ try{ return JSON.parse(localStorage.getItem('trustshield_user')||'{}'); }catch(e){ return {}; } });
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');
  const [tickets, setTickets] = useState([
    {id:'DSP172901', issue:'Wrong amount', email:'rahul@mail.com', status:'Open', priority:'High'},
    {id:'DSP172902', issue:'Fraud alert', email:'priya@mail.com', status:'Open', priority:'Medium'},
    {id:'KYC001', issue:'Aadhaar pending', email:'amit@mail.com', status:'Pending', priority:'Low'},
  ]);
  const [searchResult, setSearchResult] = useState('');
  const [newTicket, setNewTicket] = useState({issue:'', email:''});
  const [chatMsgs, setChatMsgs] = useState([{from:'agent', text:'Hello! How can I help you today?'}]);
  const [chatInput, setChatInput] = useState('');
  const dark = theme==='dark';
  const s={width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',fontSize:'14px',boxSizing:'border-box' as const,
    background:dark?'#1e293b':'#ffffff',color:dark?'#ffffff':'#000000',border:dark?'1px solid #475569':'1px solid #cbd5e1'};
  const card={background:dark?'#111f3a':'#fff',padding:'20px',borderRadius:'16px',margin:'12px 0'};
  const stat={flex:1,minWidth:'120px',background:dark?'#1e293b':'#f1f5f9',padding:'14px',borderRadius:'12px',textAlign:'center' as const};
  useEffect(()=>{ const t=setInterval(()=>setDt(getDateTime()),1000); return ()=>clearInterval(t); },[]);
  return (
    <div style={{ background: dark?'#0a0a0a':'#f1f5f9', color: dark?'#fff':'#000', minHeight:'100vh', padding:'20px' }}>
      <SuccessToast msg={msg} onClose={()=>setMsg('')} />
      <div style={{display:'flex',gap:'10px',margin:'10px 0'}}>
        <div style={{flex:1,padding:'12px',background:'#dbeafe',borderRadius:'10px',textAlign:'center'}}><b>{tickets.filter(x=>x.status==='Open').length}</b><br/>Open</div>
        <div style={{flex:1,padding:'12px',background:'#dcfce7',borderRadius:'10px',textAlign:'center'}}><b>{tickets.filter(x=>x.status==='Resolved'||x.status==='Verified').length}</b><br/>Resolved</div>
        <div style={{flex:1,padding:'12px',background:'#fef3c7',borderRadius:'10px',textAlign:'center'}}><b>{tickets.filter(x=>x.status==='Escalated').length}</b><br/>Escalated</div>
      </div>
      {searchResult && <div style={{padding:'10px',background:'#f0fdf4',borderRadius:'8px',margin:'10px 0',fontSize:'13px'}}>{searchResult}</div>}
      <h3>Ticket Overview</h3>
      {user.uid && <div>UID: {user.uid}</div>}
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
        <button onClick={()=>{if(!search){setMsg('Enter email to search');return;} setSearchResult('Profile: '+search+' | Status: Verified | Balance: $5,240'); setMsg('Customer profile loaded: '+search);}} style={{...s,background:'#2563eb',color:'#fff',border:'none',fontWeight:'bold'}}>Search Customer</button>
      </div>
      <div style={card}>
        <h3>🎫 Priority Tickets</h3>
        <p>🔴 <b>DSP172901</b> — Wrong amount 00 • rahul@mail.com <button onClick={()=>{setTickets(tickets.map(x=>x.id==='DSP172901'?{...x,status:'Resolved'}:x)); setMsg('Ticket DSP172901 resolved');}} style={{marginLeft:'8px',padding:'6px 12px',borderRadius:'6px',border:'none',background:'#16a34a',color:'#fff'}}>Resolve</button></p>
        <p>🟡 <b>DSP172902</b> — Fraud alert • priya@mail.com <button onClick={()=>{setTickets(tickets.map(x=>x.id==='DSP172902'?{...x,status:'Escalated'}:x)); setMsg('Ticket DSP172902 escalated to Risk');}} style={{marginLeft:'8px',padding:'6px 12px',borderRadius:'6px',border:'none',background:'#f59e0b',color:'#fff'}}>Escalate</button></p>
        <p>🟢 <b>KYC001</b> — Aadhaar pending • amit@mail.com <button onClick={()=>{setTickets(tickets.map(x=>x.id==='KYC001'?{...x,status:'Verified'}:x)); setMsg('KYC KYC001 verified');}} style={{marginLeft:'8px',padding:'6px 12px',borderRadius:'6px',border:'none',background:'#7c3aed',color:'#fff'}}>Verify KYC</button></p>
      </div>
      <div style={card}>
        <h3>🎫 Create New Ticket</h3>
        <input placeholder="Customer Email" value={newTicket.email} onChange={e=>setNewTicket({...newTicket,email:e.target.value})} style={s} />
        <input placeholder="Issue Description" value={newTicket.issue} onChange={e=>setNewTicket({...newTicket,issue:e.target.value})} style={s} />
        <button onClick={()=>{if(!newTicket.email||!newTicket.issue){setMsg('Enter email and issue');return;} const id='DSP'+Math.floor(100000+Math.random()*900000); setTickets([...tickets,{id:id, issue:newTicket.issue, email:newTicket.email, status:'Open', priority:'Medium'}]); setMsg('Ticket '+id+' created'); setNewTicket({issue:'',email:''});}} style={{...s,background:'#2563eb',color:'#fff',border:'none',fontWeight:'bold'}}>Create Ticket</button>
      </div>
      <div style={card}>
        <h3>💬 Live Chat</h3>
        <div style={{height:'200px',overflowY:'auto',border:'1px solid #e5e7eb',borderRadius:'8px',padding:'10px',marginBottom:'10px',background:dark?'#0a0a0a':'#f9fafb'}}>
          {chatMsgs.map((m,i)=><div key={i} style={{textAlign:m.from==='agent'?'left':'right',margin:'6px 0'}}>
            <span style={{display:'inline-block',padding:'8px 12px',borderRadius:'12px',background:m.from==='agent'?'#dbeafe':'#dcfce7',fontSize:'13px'}}>{m.text}</span>
          </div>)}
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          <input placeholder="Type message..." value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyPress={e=>{if(e.key==='Enter' && chatInput){setChatMsgs([...chatMsgs,{from:'customer',text:chatInput}]); setTimeout(()=>setChatMsgs(prev=>[...prev,{from:'agent',text:'Thanks for your message. An agent will respond shortly.'}]),1000); setChatInput('');}}} style={{...s,flex:1,margin:0}} />
          <button onClick={()=>{if(!chatInput)return; setChatMsgs([...chatMsgs,{from:'customer',text:chatInput}]); setTimeout(()=>setChatMsgs(prev=>[...prev,{from:'agent',text:'Thanks for your message. An agent will respond shortly.'}]),1000); setChatInput('');}} style={{padding:'12px 20px',borderRadius:'10px',border:'none',background:'#2563eb',color:'#fff',fontWeight:'bold'}}>Send</button>
        </div>
      </div>
    </div>
  );
}
