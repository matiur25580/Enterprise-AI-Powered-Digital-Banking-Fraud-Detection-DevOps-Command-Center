export function formatDateDDMMYYYY(d = new Date()) {
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

export function formatTimeHHMMSS(d = new Date()) {
  let h = d.getHours();
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const p = n => String(n).padStart(2, '0');
  return `${p(h)}.${p(d.getMinutes())}.${p(d.getSeconds())} ${ap}`;
}

export function successMsg(msg) {
  return { type: 'success', text: msg, color: 'green' };
}
