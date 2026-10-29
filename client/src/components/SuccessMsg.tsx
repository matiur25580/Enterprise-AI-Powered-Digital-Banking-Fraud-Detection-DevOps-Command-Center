import { useState } from 'react';
export function useSuccess() {
  const [msg, setMsg] = useState('');
  const show = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };
  const box = msg ? <div style={{ background:'#e6fffa', color:'#027a48', border:'1px solid #6ce9a6', padding:'12px', margin:'10px 0', borderRadius:'6px', fontWeight:'bold' }}>✓ {msg}</div> : null;
  return { show, box };
}
