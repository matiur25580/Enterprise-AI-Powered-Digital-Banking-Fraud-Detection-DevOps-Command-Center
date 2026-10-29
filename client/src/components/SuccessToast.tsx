import { useEffect } from 'react';
export default function SuccessToast({ msg, onClose }: { msg: string, onClose: () => void }) {
  useEffect(() => {
    if(!msg) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [msg]);
  if(!msg) return null;
  return (
    <div style={{ position:'fixed', top:'20px', right:'20px', background:'#16a34a', color:'#fff', padding:'12px 20px', borderRadius:'8px', zIndex:9999, fontWeight:'bold' }}>
      ✅ {msg}
    </div>
  );
}
export function showSuccess(setMsg:any, text:string){
  setMsg(text);
}
