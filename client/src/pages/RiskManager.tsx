import { useState, useEffect } from 'react';

export default function RiskManager() {
  const [theme, setTheme] = useState('dark');
  const [msg, setMsg] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = now.toLocaleDateString('en-GB').replaceAll('/', '.');
  const timeStr = now.toLocaleTimeString('en-US', { hour12: true });

  const approveTx = () => {
    setMsg('Transaction approved successfully');
    setTimeout(() => setMsg(''), 3000);
  };

  const blockTx = () => {
    setMsg('Transaction blocked and flagged');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div style={{ background: theme === 'dark' ? '#0a0a0a' : '#fff', color: theme === 'dark' ? '#fff' : '#000', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Risk Manager - Fraud Intelligence</h1>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle Theme</button>
      </div>
      <p>{dateStr} | {timeStr}</p>
      {msg && <p style={{ color: '#0284c7', background: '#e0f2fe', padding: '10px' }}>{msg}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '15px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '15px' }}><h3>Avg Fraud Score</h3><p>24 / 100</p></div>
        <div style={{ border: '1px solid #ccc', padding: '15px' }}><h3>High Risk Today</h3><p>7 transactions</p></div>
        <div style={{ border: '1px solid #ccc', padding: '15px' }}><h3>AI Model</h3><p>Active - Python FastAPI</p></div>
      </div>

      <h2 style={{ marginTop: '20px' }}>7-Day Fraud Trend - NEXT 7 DAYS</h2>
      <div style={{ background: '#8b5cf6', color: '#fff', padding: '15px', marginTop: '10px' }}>
        <p>Trend: rising / falling / stable - AI demand forecast chart</p>
        <p>Mon 12 | Tue 18 | Wed 9 | Thu 22 | Fri 15 | Sat 8 | Sun 11</p>
      </div>

      <h2 style={{ marginTop: '20px' }}>Flagged Transactions</h2>
      <table border={1} cellPadding={8} style={{ width: '100%', marginTop: '10px' }}>
        <thead><tr><th>ID</th><th>Amount</th><th>AI Score</th><th>Risk</th><th>Action</th></tr></thead>
        <tbody>
          <tr><td>TXN102</td><td>$18,000</td><td>92</td><td style={{ color: 'red' }}>high</td><td><button onClick={blockTx}>Block</button> <button onClick={approveTx}>Approve</button></td></tr>
          <tr><td>TXN103</td><td>$9,500</td><td>78</td><td style={{ color: 'orange' }}>medium</td><td><button onClick={blockTx}>Block</button> <button onClick={approveTx}>Approve</button></td></tr>
          <tr><td>TXN104</td><td>$3,200</td><td>15</td><td style={{ color: 'green' }}>low</td><td><button onClick={approveTx}>Approve</button></td></tr>
        </tbody>
      </table>
    </div>
  );
}
