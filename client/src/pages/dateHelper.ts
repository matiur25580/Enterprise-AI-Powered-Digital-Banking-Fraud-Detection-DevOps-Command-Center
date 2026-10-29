export function getDateTime() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2,'0');
  const mm = String(now.getMonth()+1).padStart(2,'0');
  const yyyy = now.getFullYear();
  const dateStr = dd+'.'+mm+'.'+yyyy;
  let h = now.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12; h = h ? h : 12;
  const timeStr = String(h).padStart(2,'0')+'.'+String(now.getMinutes()).padStart(2,'0')+'.'+String(now.getSeconds()).padStart(2,'0')+' '+ampm;
  return { dateStr, timeStr };
}
