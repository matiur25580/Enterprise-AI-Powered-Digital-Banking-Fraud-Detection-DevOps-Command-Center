import { useState, useEffect } from 'react';
export default function Customer() {
  const [theme, setTheme] = useState('dark');
  const [msg, setMsg] = useState('');
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const dateStr = now.toLocaleDateString('en-GB').replaceAll('/', '.');
  const timeStr = now.toLocaleTimeString('en-US', { hour12: true });
  const sendMoney = () => { setMsg('Transfer completed successfully'); setTimeout(() => setMsg(''), 3000); };
  return (
    <div style={{ background: theme === 'dark' ? '#0a0a0a' : '#fff', color: theme === 'dark' ? '#fff' : '#000', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Customer - Digital Banking</h1>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle Theme</button>
      </div>
      <p>{dateStr} | {timeStr}</p>
      {msg && <p style={{ color: '#0284c7', background: '#e0f2fe', padding: '10px' }}>{msg}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '15px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '15px' }}><h3>Balance</h3><p>$12,450.00</p></div>
        <div style={{ border: '1px solid #ccc', padding: '15px' }}><h3>This Month</h3><p>$3,200 sent</p></div>
        <div style={{ border: '1px solid #ccc', padding: '15px' }}><h3>Account</h3><td>Active</td></div>
      </div>
      <h2 style={{ marginTop: '20px' }}>Send Money</h2>
      <div style={{ marginTop: '10px' }}>
        <input placeholder="To Account" style={{ padding: '8px', marginRight: '10px' }} />
        <input placeholder="Amount" style={{ padding: '8px', marginRight: '10px' }} />
        <button onClick={sendMoney}>Send</button>
      </div>
      <h2 style={{ marginTop: '20px' }}>Recent Transactions</h2>
      <table border={1} cellPadding={8} style={{ width: '100%', marginTop: '10px' }}>
        <thead><tr><th>ID</th><th>To</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>TXN201</td><td>John D.</td><td>$500</td><td>Completed</td></tr>
          <tr><td>TXN202</td><td>Sarah K.</td><td>$1,200</td><td>Completed</td></tr>
        </tbody>
      </table>
    </div>
  );
}
