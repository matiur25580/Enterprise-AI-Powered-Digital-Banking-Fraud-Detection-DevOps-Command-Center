import { useState, useEffect } from 'react';
import { getDateTime } from './dateHelper';
import { useSuccess } from '../components/SuccessMsg';
export default function Admin() {
  const [theme, setTheme] = useState('dark');
  const [dt, setDt] = useState(getDateTime());
  const { show, box } = useSuccess();
  useEffect(()=>{ const t=setInterval(()=>setDt(getDateTime()),1000); return ()=>clearInterval(t); },[]);
  return (
    <div style={{ background: theme==='dark'?'#0a0a0a':'#fff', color: theme==='dark'?'#fff':'#000', minHeight:'100vh', padding:'20px' }}>
      <div style={{ background:'#dc2626', color:'#fff', padding:'10px', textAlign:'center', fontWeight:'bold' }}>ROLE: ADMIN</div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'10px' }}>
        <div><p>Date: {dt.dateStr}</p><p>Time: {dt.timeStr}</p></div>
        <div><button onClick={()=>{localStorage.removeItem("token"); window.location.href="/login";}} style={{marginRight:'10px'}}>Logout</button><button onClick={()=>setTheme(theme==='dark'?'light':'dark')}>🌙/☀️ Theme</button></div>
      </div>
      <h1>Admin - Command Center</h1>
      {box}
      <div style={{ marginTop:'15px' }}>
        <button onClick={()=>show('User added successfully')} style={{marginRight:'10px'}}>Add User</button>
        <button onClick={()=>show('User updated successfully')} style={{marginRight:'10px'}}>Edit</button>
        <button onClick={()=>show('User deleted successfully')} style={{marginRight:'10px'}}>Delete</button>
        <button onClick={()=>show('Account frozen successfully')} style={{marginRight:'10px'}}>Freeze</button>
        <button onClick={()=>show('Approved successfully')}>Approve</button>
      </div>
      <p style={{marginTop:'15px'}}>Sob action e upore green success message asbe</p>
    </div>
  );
}
