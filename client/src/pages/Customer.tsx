import { useState, useEffect } from 'react';
import { getDateTime } from './dateHelper';
import SuccessToast from '../components/SuccessToast';
export default function Customer() {
  const [theme, setTheme] = useState('dark');
  const [dt, setDt] = useState(getDateTime());
  const [msg, setMsg] = useState('');
  useEffect(()=>{ const t=setInterval(()=>setDt(getDateTime()),1000); return ()=>clearInterval(t); },[]);
  const doAction = (t:string)=>{ setMsg(t+' successful'); };
  return (
    <div style={{ background: theme==='dark'?'#0a0a0a':'#fff', color: theme==='dark'?'#fff':'#000', minHeight:'100vh', padding:'20px' }}>
      <SuccessToast msg={msg} onClose={()=>setMsg('')} />
      <div style={{ background:'#16a34a', color:'#fff', padding:'10px', textAlign:'center', fontWeight:'bold', fontSize:'20px' }}>ROLE: CUSTOMER</div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'10px' }}>
        <div><p>Date: {dt.dateStr}</p><p>Time: {dt.timeStr}</p></div>
        <div>
          <button onClick={()=>{localStorage.removeItem('token'); window.location.href='/login';}} style={{marginRight:'10px'}}>Logout</button>
          <button onClick={()=>setTheme(theme==='dark'?'light':'dark')}>🌙/☀️ Theme</button>
        </div>
      </div>
      <h1>Customer - Digital Banking</h1>
      <p>You are logged in as <b>Customer</b></p>
      <button onClick={()=>doAction('Action')} style={{marginTop:'10px'}}>Test Success Message</button>
    </div>
  );
}
