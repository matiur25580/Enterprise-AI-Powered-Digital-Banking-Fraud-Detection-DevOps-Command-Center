export const API = (import.meta as any).env.VITE_API_URL || "http://localhost:5000";
export async function apiGet(path: string) {
  const r = await fetch(API + path);
  return r.json();
}
export async function apiPost(path: string, body: any) {
  const r = await fetch(API + path, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(body)
  });
  return r.json();
}
