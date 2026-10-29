import { useState } from 'react';
export default function Register() {
  const [theme, setTheme] = useState('dark');
  return (
    <div style={{ background: theme==='dark'?'#0a0a0a':'#fff', color: theme==='dark'?'#fff':'#000', minHeight:'100vh', padding:'20px' }}>
      <div style={{ display:'flex', justifyContent:'flex-end' }}><button onClick={()=>setTheme(theme==='dark'?'light':'dark')}>🌙/☀️ Theme</button></div>
      <h1>Register - TrustShield</h1>
      <p>Full name, email, password, confirm password + SUBMIT</p>
    </div>
  );
}
