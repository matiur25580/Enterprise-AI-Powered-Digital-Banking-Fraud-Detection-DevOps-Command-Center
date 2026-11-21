export async function logout() {
  const token = localStorage.getItem('trustshield_token');
  const api = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';
  try {
    if (token) await fetch(api + '/api/auth/logout', { method: 'POST', credentials: 'include', headers: { Authorization: 'Bearer ' + token } });
  } finally {
    localStorage.removeItem('trustshield_token');
    localStorage.removeItem('trustshield_user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('trustshield_csrf');
    window.location.href = '/login';
  }
}
