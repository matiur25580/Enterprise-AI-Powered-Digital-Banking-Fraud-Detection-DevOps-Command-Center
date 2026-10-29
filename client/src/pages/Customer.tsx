import { useState, useEffect } from 'react';
export default function Customer() {
  const [theme, setTheme] = useState('dark');
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <div style={{ background: theme==='dark'?'#0a0a0a':'#fff', color: theme==='dark'?'#fff':'#000', minHeight:'100vh', padding:'20px' }}>
      <div style={{ background:'#16a34a', color:'#fff', padding:'10px', textAlign:'center', fontWeight:'bold', fontSize:'20px' }}>ROLE: CUSTOMER</div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'10px' }}>
        <h1>Customer - Digital Banking</h1>
        <button onClick={()=>{localStorage.removeItem("token"); window.location.href="/login";}} style={{marginRight:"10px"}}>Logout</button><button onClick={()=>setTheme(theme==='dark'?'light':'dark')}>🌙/☀️ Theme</button>
      </div>
      <p>{now.toLocaleDateString('en-GB').replaceAll('/','.')} | {now.toLocaleTimeString('en-US',{hour12:true})}</p>
      <p>You are logged in as <b>Customer</b></p>
    </div>
  );
}
