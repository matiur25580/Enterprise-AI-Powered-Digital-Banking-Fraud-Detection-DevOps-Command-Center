import { useState, useEffect } from 'react';
export default function SupportAgent() {
  const [theme, setTheme] = useState('dark');
  const [msg, setMsg] = useState('');
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const dateStr = now.toLocaleDateString('en-GB').replaceAll('/', '.');
  const timeStr = now.toLocaleTimeString('en-US', { hour12: true });
  const verifyKYC = () => { setMsg('KYC verified successfully'); setTimeout(() => setMsg(''), 3000); };
  return (
    <div style={{ background: theme === 'dark' ? '#0a0a0a' : '#fff', color: theme === 'dark' ? '#fff' : '#000', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Support Agent - Customer Care</h1>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle Theme</button>
      </div>
      <p>{dateStr} | {timeStr}</p>
      {msg && <p style={{ color: 'green', background: '#e6fffa', padding: '10px' }}>{msg}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '15px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '15px' }}><h3>Pending KYC</h3><p>42</p></div>
        <div style={{ border: '1px solid #ccc', padding: '15px' }}><h3>Open Tickets</h3><p>18</p></div>
        <div style={{ border: '1px solid #ccc', padding: '15px' }}><h3>Resolved Today</h3><p>65</p></div>
      </div>
      <h2 style={{ marginTop: '20px' }}>KYC Queue</h2>
      <table border={1} cellPadding={8} style={{ width: '100%', marginTop: '10px' }}>
        <thead><tr><th>User</th><th>Document</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          <tr><td>Rahim U.</td><td>NID + Selfie</td><td>Pending</td><td><button onClick={verifyKYC}>Verify</button></td></tr>
          <tr><td>Karim S.</td><td>Passport</td><td>Pending</td><td><button onClick={verifyKYC}>Verify</button></td></tr>
        </tbody>
      </table>
    </div>
  );
}
