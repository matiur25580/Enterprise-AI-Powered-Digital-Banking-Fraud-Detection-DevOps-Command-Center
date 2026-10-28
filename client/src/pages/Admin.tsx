import { useState, useEffect } from 'react';

export default function Admin() {
  const [theme, setTheme] = useState('dark');
  const [msg, setMsg] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = now.toLocaleDateString('en-GB').replaceAll('/', '.');
  const timeStr = now.toLocaleTimeString('en-US', { hour12: true });

  const freezeAccount = () => {
    setMsg('Account frozen successfully');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div style={{ background: theme === 'dark' ? '#0a0a0a' : '#ffffff', color: theme === 'dark' ? '#ffffff' : '#000000', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Admin - Command Center</h1>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle Theme</button>
      </div>
      <p>{dateStr} | {timeStr}</p>
      {msg && <p style={{ color: 'green', background: '#e6fffa', padding: '10px' }}>{msg}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '15px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '15px' }}><h3>Total Users</h3><p>1,248</p></div>
        <div style={{ border: '1px solid #ccc', padding: '15px' }}><h3>Transactions</h3><p>8,540</p></div>
        <div style={{ border: '1px solid #ccc', padding: '15px' }}><h3>Flagged Fraud</h3><p>23</p></div>
      </div>
      <h2 style={{ marginTop: '20px' }}>Live Transactions</h2>
      <table border={1} cellPadding={8} style={{ width: '100%', marginTop: '10px' }}>
        <thead><tr><th>ID</th><th>Amount</th><th>Fraud Score</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          <tr><td>TXN001</td><td>$5,000</td><td>12</td><td>Approved</td><td><button onClick={freezeAccount}>Freeze</button></td></tr>
          <tr><td>TXN002</td><td>$25,000</td><td>85</td><td>Flagged</td><td><button onClick={freezeAccount}>Freeze</button></td></tr>
        </tbody>
      </table>
    </div>
  );
}
